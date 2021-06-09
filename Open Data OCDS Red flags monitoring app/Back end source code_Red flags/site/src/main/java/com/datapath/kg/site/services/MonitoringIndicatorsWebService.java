package com.datapath.kg.site.services;

import com.datapath.kg.elasticsearchintegration.domain.FilterQuery;
import com.datapath.kg.elasticsearchintegration.domain.FilteringDTO;
import com.datapath.kg.elasticsearchintegration.services.ElasticsearchDataExtractorService;
import com.datapath.kg.persistence.domain.BaseEntitiesCountData;
import com.datapath.kg.persistence.service.TenderDataService;
import com.datapath.kg.site.request.export.ExportRequest;
import com.datapath.kg.site.services.export.ExportService;
import com.datapath.kg.site.util.exception.CustomException;
import com.datapath.kg.site.util.exception.ExceptionInfo;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MonitoringIndicatorsWebService {

    private static final int EXPORT_MAX_QUANTITY = 60_000;

    private ElasticsearchDataExtractorService elasticService;
    private TenderDataService tenderDataService;
    private ExportService exportService;

    public MonitoringIndicatorsWebService(ElasticsearchDataExtractorService elasticService,
                                          TenderDataService tenderDataService,
                                          ExportService exportService) {
        this.elasticService = elasticService;
        this.tenderDataService = tenderDataService;
        this.exportService = exportService;
    }

    public FilteringDTO getFilteringDto(FilterQuery filterQuery) {
        FilteringDTO filteringDTO = elasticService.applyFilter(filterQuery);
        filteringDTO.setKpiInfo(elasticService.getKpiInfo());
        filteringDTO.setKpiInfoFiltered(elasticService.getKpiInfoFiltered(filterQuery));
        filteringDTO.setChartsDataWraper(elasticService.getChartsDataWrapper(filterQuery));

        BaseEntitiesCountData basicEntityCountData = tenderDataService.getBaseEntityCountData();

        filteringDTO.getKpiInfo().setAllProcedureCount(basicEntityCountData.getProceduresCount());
        filteringDTO.getKpiInfo().setAllProcedureValue(basicEntityCountData.getProceduresAmount());
        filteringDTO.getKpiInfo().setAllBuyerCount(basicEntityCountData.getBuyersCount());

        filteringDTO.getKpiInfo().setRiskProcedureCountPercent(
                (double) filteringDTO.getKpiInfo().getCheckedRiskProceduresCount() / filteringDTO.getKpiInfo().getCheckedProceduresCount() * 100
        );

        filteringDTO.getKpiInfo().setRiskProcedureAmountPercent(
                (double) filteringDTO.getKpiInfo().getCheckedRiskProceduresValue() / filteringDTO.getKpiInfo().getCheckedProceduresValue() * 100
        );

        filteringDTO.getChartsDataWraper().getKpiCharts().setAllProceduresAmount(tenderDataService.getProceduresAmountByMonth());
        filteringDTO.getChartsDataWraper().getKpiCharts().setAllProceduresCount(tenderDataService.getProceduresCountByMonth());

        return filteringDTO;
    }

    public Object getFilterData(FilterQuery filterQuery) {
        return elasticService.getFilterData(filterQuery);
    }

    public Object checkAll(FilterQuery filterQuery) {
        filterQuery.setSize(50000);
        return elasticService.checkAll(filterQuery);
    }

    public ResponseEntity<Resource> export(ExportRequest exportRequest) {
        if (exportRequest.getTenderIds().size() > EXPORT_MAX_QUANTITY) {
            throw new CustomException(ExceptionInfo.E1);
        }
        Resource resource = new ByteArrayResource(exportService.export(exportRequest.getTenderIds(), exportRequest.getLocale().getKey()));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Ternders_Export.xlsx\"")
                .body(resource);
    }

    @Transactional
    public ResponseEntity<Resource> export() {
        Resource resource = new ByteArrayResource(exportService.export());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Failed Releases.xlsx\"")
                .body(resource);
    }
}
