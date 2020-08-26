package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

@Data
public class PaymentScheduleDAO {

    private String paymentDate;
    private String paymentDueDate;
    private String paymentType;
    private String paymentCondition;

}