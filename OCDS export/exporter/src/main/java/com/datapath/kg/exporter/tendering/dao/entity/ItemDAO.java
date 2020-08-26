package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

@Data
public class ItemDAO {

    private String id;
    private String relatedLot;
    private String classificationId;
    private String classificationScheme;
    private String classificationDescription;
    private Double quantity;
    private String unitId;
    private String unitName;
    private String unitValueAmount;
    private String unitValueCurrency;

}
