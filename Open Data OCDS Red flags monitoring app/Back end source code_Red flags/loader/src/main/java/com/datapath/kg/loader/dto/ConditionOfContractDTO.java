package com.datapath.kg.loader.dto;

import lombok.Data;

@Data
public class ConditionOfContractDTO {
    private String id;
    private String lateDeliveryRate;
    private String latePaymentRate;
    private String lateGuaranteeRate;
    private String guaranteePercent;
    private String maxDeductibleAmountDelivery;
    private String maxDeductibleAmountPayment;
    private String maxDeductibleAmountGuarantee;
    private Boolean hasGuarantee;
    private Boolean hasInsurance;
    private Boolean hasRelatedServices;
    private Boolean hasSpares;
    private Boolean hasTechnicalControl;
    private Boolean hasAcceptancePayment;
    private String acceptancePaymentPercent;
    private Boolean hasArbitralTribunal;

}
