package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class ConditionOfContract {

    @Field("id")
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
    private Boolean hasPrepayment;
    private Boolean hasAcceptancePayment;
    private Boolean hasShipmentPayment;
    private String prepaymentPercent;
    private String acceptancePaymentPercent;
    private String shipmentPaymentPercent;
    private String insuranceType;
    private Boolean hasArbitralTribunal;

}
