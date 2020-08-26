package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class Tender {

    @Field("id")
    private Integer id;
    private String title;
    private String tenderNumber;
    private String status;
    private String statusDetails;
    private OffsetDateTime datePublished;
    private OffsetDateTime date;
    private String procurementMethod;
    private String procurementMethodDetails;
    private String procurementMethodRationale;
    private Value value;
    private Period tenderPeriod;
    private Period enquiryPeriod;
    private String procurementSubMethodDetails;

    private boolean hasPrequalification;
    private Boolean hasExternalSystem;

    private Guarantee guarantee;
    private String mainProcurementCategory;

    private ConditionOfContract conditionOfContract;
    private List<QualificationRequirement> qualificationRequirements;
    private List<Item> items;
    private List<Lot> lots;
    private List<Enquiry> enquiries;
    private List<Document> documents;
    private ProcuringEntity procuringEntity;
}
