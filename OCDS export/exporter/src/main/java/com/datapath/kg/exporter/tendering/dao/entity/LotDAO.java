package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

@Data
public class LotDAO {

    private String id;
    private String initialAmount;
    private String amount;
    private String currency;
    private String status;
    private String lotNumber;
    private String relatedPlanId;
    private String deliveryAddress;
    private String deliveryDateDetails;
    private String deliveryTerms;
    private String title;
}
