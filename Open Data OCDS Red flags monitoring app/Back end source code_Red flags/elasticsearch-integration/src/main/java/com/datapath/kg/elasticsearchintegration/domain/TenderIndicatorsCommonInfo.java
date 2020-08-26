package com.datapath.kg.elasticsearchintegration.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TenderIndicatorsCommonInfo {
    public String tenderId;
    public String tenderOuterId;
    public String tenderDatePublished;
    public String tenderProcurementMethodDetails;
    public String tenderStatusDetails;
    public Double tenderAmount;

    public Set<String> itemCpv2;
    public Set<String> itemCpv;

    public String buyerId;
    public String buyerName;
    public String buyerRegion;

    public Set<Integer> indicatorsWithRisk;
    public Set<Integer> indicatorsWithoutRisk;
    public Set<Integer> indicators;

    public Integer riskLevel;

    public boolean withRisk;
    public boolean hasComplaints;
}
