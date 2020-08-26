package com.datapath.kg.elasticsearchintegration.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class KpiInfo {

    private Long allProcedureCount;
    private Double allProcedureValue;
    private Long allBuyerCount;

    private Long checkedProceduresCount;
    private Long checkedRiskProceduresCount;

    private Double checkedProceduresValue;
    private Double checkedRiskProceduresValue;

    private Long checkedRiskBuyersCount;
    private Long checkedBuyersCount;

    private Long indicatorsCount;
    private Long riskIndicatorsCount;

    private Double riskProcedureCountPercent;
    private Double riskProcedureAmountPercent;
}
