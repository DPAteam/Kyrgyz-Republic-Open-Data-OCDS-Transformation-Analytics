package com.datapath.kg.exporter.planning.dao.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ItemDAO {

    private String id;
    private String classificationScheme;
    private String classificationId;
    private String classificationDescription;
    private Double quantity;
    private String unitId;
    private String unitName;
    private BigDecimal unitAmount;
    private String unitCurrency;

}