package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

@Data
public class DeliveryScheduleDAO {

    private String deliveryStartDate;
    private String deliveryEndDate;
    private String deliveryAddress;
    private String deliveryConditions;

}