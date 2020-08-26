package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class PriceProposal {

    @Field("id")
    private String id;
    private String relatedLot;
    private String relatedItem;
    private Unit unit;


}
