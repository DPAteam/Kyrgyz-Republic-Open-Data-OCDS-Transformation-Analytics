package com.datapath.kg.common.validation;

import lombok.Data;

import java.util.List;

@Data
public class TendersReportData {
    private Integer count;
    private Integer contractBasedCount;

    private List<Integer> ids;
    private List<Integer> contractBasedIds;

}
