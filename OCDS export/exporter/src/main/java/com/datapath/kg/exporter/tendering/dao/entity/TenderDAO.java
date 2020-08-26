package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TenderDAO {

    private Integer id;
    private String title;
    private String tenderNumber;
    private String status;
    private String statusDetails;
    private LocalDateTime datePublished;
    private LocalDateTime date;
    private String procurementMethod;
    private String procurementMethodDetails;
    private String procurementMethodRationale;
    private BigDecimal valueAmount;
    private String valueCurrency;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime enquiryStartDate;
    private LocalDateTime enquiryEndDate;
    private String procurementSubMethodDetails;
    private String procuringEntityId;
    private String procuringEntityName;
    private Integer countryIsoCode;

    private Boolean hasPrequalification;
    private Boolean hasExternalSystem;

    private Double guaranteeAmount;
    private Boolean guaranteeMonetary;

    private String mainProcurementCategory;

    private ConditionOfContractDAO conditionOfContact;
    private List<QualificationRequirementDAO> qualificationRequirements;
    private List<ItemDAO> items;
    private List<LotDAO> lots;
    private List<EnquiryDAO> enquiries;
    private List<DocumentDAO> documents;
}
