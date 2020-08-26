package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class TenderDTO {
    private Integer id;
    private String status;
    private String statusDetails;
    private String date;
    private String datePublished;
    private String procurementMethodRationale;
    private String procurementMethodDetails;
    private String procurementMethod;
    private ValueDTO value;

    private List<LotDTO> lots;
    private List<ItemDTO> items;
    private List<QualificationRequirementDTO> qualificationRequirements;
    private List<EnquiryDTO> enquiries;
    private List<DocumentDTO> documents;
    private String tenderNumber;
    private PeriodDTO tenderPeriod;
    private ConditionOfContractDTO conditionOfContract;
}