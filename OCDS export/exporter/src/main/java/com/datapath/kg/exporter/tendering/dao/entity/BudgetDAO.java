package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

@Data
public class BudgetDAO {

    private Long id;
    private String description;
    private Double amount;
    private String rationale;

}