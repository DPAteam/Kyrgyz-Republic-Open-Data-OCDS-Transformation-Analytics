package com.datapath.kg.loader.dao.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "condition_of_contract")
public class ConditionOfContractEntity {

    @Id
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

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "tender_id")
    private TenderEntity tender;
}
