package com.datapath.kg.persistence.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenderData {
    private String tenderNumber;
    private String outerId;
    private String datePublished;
    private String procurementMethodDetails;
    private String statusDetails;
    private Double amount;

    private boolean hasComplaints;

    private String buyerId;
    private String buyerName;
    private String buyerRegion;

    private Integer riskLevel;

    public String indicatorsWithRisk;
    public String indicatorsWithoutRisk;
    public String indicators;
    public String okgzList;
    public String cpvList;
}
