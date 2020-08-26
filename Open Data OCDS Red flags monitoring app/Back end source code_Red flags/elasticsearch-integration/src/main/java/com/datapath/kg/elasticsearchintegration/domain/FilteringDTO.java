package com.datapath.kg.elasticsearchintegration.domain;

import com.datapath.kg.elasticsearchintegration.domain.charts.ChartsDataWraper;
import lombok.Data;

@Data
public class FilteringDTO {

    private ProceduresWrapper data;
    private KpiInfo kpiInfo;
    private KpiInfo kpiInfoFiltered;
    private ChartsDataWraper chartsDataWraper;
    private AvailableFilters availableFilters;
}
