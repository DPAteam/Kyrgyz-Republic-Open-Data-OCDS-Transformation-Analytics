package com.datapath.kg.loader.utils;

import java.util.Arrays;
import java.util.List;

public final class Constants {

    private Constants() {
    }

    public static final String ACTIVE = "active";
    public static final String CANCELLED = "cancelled";
    public static final String UNSUCCESSFUL = "unsuccessful";

    private static final String BIDS_OPENED = "bidsOpened";
    private static final String EVALUATION_RESULTS_PENDING = "evaluationResultsPending";
    private static final String EVALUATION_COMPLETE = "evaluationComplete";
    private static final String CONTRACT_SIGNED = "contractSigned";

    public static final String MESSAGE_SUBJECT = "Release persist failed";
    public static final String MESSAGE_TEMPLATE = "ocid: %s\n" +
            "release id: %s\n" +
            "release date: %s\n" +
            "tender number: %s\n" +
            "persist fail date: %s\n" +
            "exception: %s\n" +
            "error message: %s\n";

    public static final List<String> SKIPPED_BIDS_TENDER_STATUS_DETAILS = Arrays.asList(
            BIDS_OPENED,
            EVALUATION_RESULTS_PENDING,
            EVALUATION_COMPLETE,
            CONTRACT_SIGNED
    );

    public static final List<String> SKIPPED_AWARDS_TENDER_STATUS_DETAILS = Arrays.asList(
            EVALUATION_RESULTS_PENDING,
            EVALUATION_COMPLETE,
            CONTRACT_SIGNED
    );

    public static final List<String> LOT_GOOD_QUALITY_STATUS_DETAILS = Arrays.asList(
            CANCELLED,
            UNSUCCESSFUL
    );
}
