package com.datapath.kg.common.validation;

import lombok.Data;

import java.util.Collection;

@Data
public class PlanningReportData {
    private int count;
    private Collection<Integer> ids;
}
