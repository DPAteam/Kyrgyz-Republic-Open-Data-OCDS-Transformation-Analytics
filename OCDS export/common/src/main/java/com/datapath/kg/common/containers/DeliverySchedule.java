package com.datapath.kg.common.containers;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class DeliverySchedule {

    private OffsetDateTime deliveryStartDate;
    private OffsetDateTime deliveryEndDate;
    private String deliveryAddress;
    private String deliveryConditions;

}
