package com.datapath.kg.elasticsearchintegration.constants;

public enum ProcedureProperty {
    TENDER_PROCUREMENT_METHOD_DETAIL_KEYWORD("tenderProcurementMethodDetails.keyword"),
    TENDER_ID_KEYWORD("tenderId.keyword"),
    WITH_RISK("withRisk"),
    BUYER_NAME_KEYWORD("buyerName.keyword"),
    BUYER_ID_KEYWORD("buyerId.keyword"),
    INDICATORS_WITH_RISK("indicatorsWithRisk"),
    INDICATORS("indicators"),
    TENDER_STATUS_DETAIL_KEYWORD("tenderStatusDetails.keyword"),
    BUYER_REGION_KEYWORD("buyerRegion.keyword"),
    ITEM_CPV2_KEYWORD("itemCpv2.keyword"),
    ITEM_CPV_KEYWORD("itemCpv.keyword"),
    DATE_PUBLISHED("tenderDatePublished"),
    AMOUNT("tenderAmount"),
    RISK_LEVEL("riskLevel"),
    HAS_COMPLAINTS("hasComplaints"),
    ;

    private final String value;

    ProcedureProperty(String value) {
        this.value = value;
    }

    public String value() {
        return this.value;
    }

}