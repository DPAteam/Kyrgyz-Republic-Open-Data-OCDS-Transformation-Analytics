package com.datapath.kg.exporter;

import lombok.Getter;

@Getter
public class Constants {

    public static final String OCID_PREFIX = "ocds-h7i0z4-";
    public static final String PLANNING_TAG = "planning";
    public static final String TENDER_INITIATION_TYPE = "tender";

    public static class Tag {
        public static final String TENDER = "tender";
        public static final String COMPLAINT = "complaint";
        public static final String AWARD = "award";
        public static final String CONTRACT = "contract";
    }
}
