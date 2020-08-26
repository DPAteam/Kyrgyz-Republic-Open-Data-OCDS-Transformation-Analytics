package com.datapath.kg.common.validation;

import lombok.Data;

import java.util.List;

@Data
public class ContractsReportData {

    private Integer count;
    private Integer centralizedCount;
    private Integer contractBasedCount;

    private List<String> ids;
    private List<String> centralizedIds;
    private List<String> contractBasedIds;

}
