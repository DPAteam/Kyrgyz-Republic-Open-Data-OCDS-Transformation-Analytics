package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ContractDAO {

    private Long id;
    private String type;
    private String contractNumber;
    private String dateSigned;
    private BigDecimal amountDiscounted;
    private BigDecimal amount;
    private String currency;

    private List<Long> awardIDs;
    private List<DeliveryScheduleDAO> deliveriesSchedule;
    private List<PaymentScheduleDAO> paymentsSchedule;
}