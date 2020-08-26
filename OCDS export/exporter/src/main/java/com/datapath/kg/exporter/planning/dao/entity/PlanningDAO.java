package com.datapath.kg.exporter.planning.dao.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlanningDAO {

    private int id;
    private Integer budgetYear;
    private String dateCreated;
    private String dateChanged;
    private String status;
    private String type;
    private BigDecimal amount;
    private String currency;
    private String buyerId;
    private String buyerName;

}
