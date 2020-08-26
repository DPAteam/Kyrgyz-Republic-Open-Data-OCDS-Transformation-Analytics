package com.datapath.kg.exporter.planning.dao.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PlanDAO {

    private int id;
    private String accountNumber;
    private String accountName;
    private BigDecimal amount;
    private BigDecimal reservedAmount;
    private BigDecimal savedAmount;
    private String currency;
    private LocalDateTime dateCreated;
    private String budgetLineId;
    private String budgetLineName;

}
