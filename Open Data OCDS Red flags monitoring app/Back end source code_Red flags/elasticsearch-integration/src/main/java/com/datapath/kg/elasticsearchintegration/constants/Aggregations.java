package com.datapath.kg.elasticsearchintegration.constants;

public enum Aggregations {

    BUYER_NAME_AGG("buyerNameAgg"),
    BUYER_ID_AGG("buyerIdAgg"),
    CODE_SUB_AGGREGATION("codeSubAgg"),
    TENDER_STATUS_DETAIL_AGG("tenderStatusDetailsAgg"),
    TENDER_PROCUREMENT_METHOD_DETAILS_AGG("procurementMethodDetailsAgg"),
    INDICATORS_WITH_RISK_AGG("indicatorsWithRiskAgg"),
    BUYER_REGION_AGG("buyerRegionAgg"),
    REGION_AMOUNT_AGG("regionAmountAgg"),
    ITEM_CPV2_AGG("itemCpv2Agg"),
    ITEM_CPV_AGG("itemCpvAgg"),
    WITH_RISK_AGG("withRiskAgg"),
    HAS_COMPLAINTS_AGG("hasComplaintsAgg"),
    RISK_LEVEL_AGG("riskLevelAgg"),
    AMOUNT_OF_RISK_AGG("amountOfRiskAgg"),
    DAYS("days"),
    WITH_RISK_COUNT("withRisk"),
    PROCEDURES("procedures"),
    RISK_INDICATORS("riskIndicators"),
    RISK_INDICATORS_AMOUNT("riskIndicatorsAmount"),
    TEMP("temp");



    private final String value;

    Aggregations(String value) {
        this.value = value;
    }

    public String value() {
        return this.value;
    }

}