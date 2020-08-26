package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

@Data
public class PriceProposalDAO {

    private String id;
    private String relatedLot;
    private String relatedItem;
    private String unitValueAmount;
    private String unitValueCurrency;

}