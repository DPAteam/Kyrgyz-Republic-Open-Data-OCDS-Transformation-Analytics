package com.datapath.kg.common.containers;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class PaymentSchedule {

    private OffsetDateTime paymentDate;
    private OffsetDateTime paymentDueDate;
    private String paymentType;
    private String paymentCondition;

}