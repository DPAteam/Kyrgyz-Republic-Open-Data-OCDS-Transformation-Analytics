package com.datapath.kg.elasticsearchintegration.constants;

import java.util.Arrays;
import java.util.List;

public final class Constants {

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String ELASTICSEARCH_INDEX = "kg_tenders_indicators";

    public static final String ITEM_CPV_SEARCH_FIELD = "itemCpv";
    public static final String ITEM_CPV2_SEARCH_FIELD = "itemCpv2";

    public static final List<String> SORT_FIELDS_WITH_KEYWORD = Arrays.asList(
            "tenderId",
            "tenderProcurementMethodDetails",
            "tenderStatusDetails",
            "buyerId",
            "buyerName",
            "buyerRegion"
    );

    public static final List<String> SORT_FIELDS_WITHOUT_KEYWORD = Arrays.asList(
            "tenderDatePublished",
            "tenderAmount",
            "riskLevel",
            "withRisk",
            "hasComplaints"
    );

    private Constants() {
    }
}
