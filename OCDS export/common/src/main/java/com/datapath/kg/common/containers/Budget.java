package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class Budget {
    @Field("id")
    private String id;
    private String description;
    //fixme init source by url to planning module
    private String source;
    private Value value;
}
