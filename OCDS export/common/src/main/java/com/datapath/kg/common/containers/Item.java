package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class Item {

    @Field("id")
    private String id;
    private String relatedLot;
    private Classification classification;
    private Double quantity;
    private Unit unit;

}
