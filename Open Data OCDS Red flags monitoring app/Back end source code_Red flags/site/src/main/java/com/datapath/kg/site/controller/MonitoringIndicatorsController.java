package com.datapath.kg.site.controller;

import com.datapath.kg.elasticsearchintegration.domain.FilterQuery;
import com.datapath.kg.elasticsearchintegration.domain.FilteringDTO;
import com.datapath.kg.site.request.export.ExportRequest;
import com.datapath.kg.site.services.MonitoringIndicatorsWebService;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("monitoring")
public class MonitoringIndicatorsController {

    private final MonitoringIndicatorsWebService monitoringIndicatorsService;

    public MonitoringIndicatorsController(MonitoringIndicatorsWebService monitoringIndicatorsService) {
        this.monitoringIndicatorsService = monitoringIndicatorsService;
    }

    @PostMapping("filter/all")
    public FilteringDTO filterEverything(@RequestBody @Valid FilterQuery filterQuery) {
        return monitoringIndicatorsService.getFilteringDto(filterQuery);
    }

    @PostMapping("filter-data")
    public Object search(@RequestBody @Valid FilterQuery filterQuery) {
        return monitoringIndicatorsService.getFilterData(filterQuery);
    }

    @PostMapping("check-all")
    public Object checkAll(@RequestBody @Valid FilterQuery filterQuery) {
        return monitoringIndicatorsService.checkAll(filterQuery);
    }

    @PostMapping("export")
    public ResponseEntity<Resource> exportToExcel(@RequestBody ExportRequest exportRequest) {
        return monitoringIndicatorsService.export(exportRequest);
    }

    @PreAuthorize("hasAnyAuthority('admin.base')")
    @PostMapping("export/unprocessed-data")
    public ResponseEntity<Resource> exportUnprocessedData() {
        return monitoringIndicatorsService.export();
    }
}
