package com.datapath.kg.elasticsearchintegration.services;

import com.datapath.kg.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.kg.persistence.domain.TenderData;
import com.datapath.kg.persistence.service.TenderDataService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Stream;

import static java.util.Objects.isNull;
import static java.util.stream.Collectors.toSet;
import static org.springframework.util.CollectionUtils.isEmpty;


@Service
@Slf4j
@Data
public class TenderObjectsProvider {

    @Value("${init.upload.days}")
    private Integer initUploadDays;
    @Value("${update.upload.days}")
    private Integer updateUploadDays;

    private static boolean initUploadInProgress = false;

    private final ElasticsearchDataUploadService elasticsearchDataUpload;
    private final TenderDataService tenderDataService;

    public TenderObjectsProvider(ElasticsearchDataUploadService elasticsearchDataUpload,
                                 TenderDataService tenderDataService) {
        this.elasticsearchDataUpload = elasticsearchDataUpload;
        this.tenderDataService = tenderDataService;
    }


    private void provideBasedOnCheckedTenders(LocalDate date) {
        log.info("elasticsearch integration started");

        long offset = 0;
        long size = 1000;

        try {
            while (true) {
                List<TenderData> tenderData = tenderDataService.getTenderData(date, size, offset);

                if (isEmpty(tenderData)) {
                    break;
                }

                log.info("processing {} - {} elements", offset, offset + tenderData.size());

                List<TenderIndicatorsCommonInfo> infos = new LinkedList<>();
                tenderData.forEach(tender -> {
                    TenderIndicatorsCommonInfo info = new TenderIndicatorsCommonInfo();

                    info.setTenderId(tender.getTenderNumber());
                    info.setTenderOuterId(tender.getOuterId());
                    info.setTenderDatePublished(tender.getDatePublished());
                    info.setTenderStatusDetails(tender.getStatusDetails());
                    info.setTenderProcurementMethodDetails(tender.getProcurementMethodDetails());
                    info.setTenderAmount(tender.getAmount());

                    info.setBuyerId(tender.getBuyerId());
                    info.setBuyerName(tender.getBuyerName());
                    info.setBuyerRegion(tender.getBuyerRegion());

                    info.setRiskLevel(isNull(tender.getRiskLevel()) ? 0 : tender.getRiskLevel());

                    info.setIndicatorsWithRisk(convertStringToSet(tender.getIndicatorsWithRisk(), Integer::parseInt));
                    info.setIndicatorsWithoutRisk(convertStringToSet(tender.getIndicatorsWithoutRisk(), Integer::parseInt));
                    info.setIndicators(convertStringToSet(tender.getIndicators(), Integer::parseInt));

                    info.setItemCpv(convertStringToSet(tender.getCpvList(), (e) -> e));
                    info.setItemCpv2(convertStringToSet(tender.getOkgzList(), (e) -> e));

                    info.setWithRisk(!isEmpty(info.getIndicatorsWithRisk()));
                    info.setHasComplaints(tender.isHasComplaints());

                    infos.add(info);
                });

                elasticsearchDataUpload.uploadItems(infos);

                offset += size;
            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }

        log.info("elasticsearch integration finished");
    }

    private <T> Set<T> convertStringToSet(String str, Function<String, T> convertFunc) {
        if (StringUtils.isEmpty(str)) {
            return Collections.emptySet();
        }

        return Stream.of(str.split(","))
                .map(convertFunc)
                .collect(toSet());
    }

    @Transactional
    public void update() {
        if (!initUploadInProgress) {
            LocalDate initDate = getUpdateStartDate(updateUploadDays);
            provideBasedOnCheckedTenders(initDate);
        }
    }

    @Transactional
    public void initUpdate() {
        initUploadInProgress = true;
        LocalDate initDate = getUpdateStartDate(initUploadDays);
        provideBasedOnCheckedTenders(initDate);
        initUploadInProgress = false;
    }

    private LocalDate getUpdateStartDate(Integer daysBefore) {
        return LocalDate.now().minusDays(daysBefore);
    }
}
