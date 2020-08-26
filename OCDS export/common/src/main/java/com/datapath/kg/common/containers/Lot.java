package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;

@Data
public class Lot {
    @Field("id")
    private String id;
    private String status;
    private String lotNumber;
    private String relatedPlanID;
    private String deliveryAddress;
    private String deliveryDateDetails;
    private String deliveryTerms;
    private Value value;
    private String title;

}
