package com.datapath.kg.loader.dto;

import lombok.Data;

@Data
public class PriceProposalDTO {
    private Integer id;
    private Integer relatedItem;
    private Integer relatedLot;
    private UnitDTO unit;
}
