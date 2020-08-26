package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class Award {

    @Field("id")
    private Long id;
    private String status;
    private List<String> relatedLots;
    private String relatedBid;
    private OffsetDateTime date;
    private Value value;

}
