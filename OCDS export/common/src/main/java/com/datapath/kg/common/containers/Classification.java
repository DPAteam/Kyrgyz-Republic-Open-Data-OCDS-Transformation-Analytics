package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class Classification {

    private String scheme;
    @Field("id")
    private String id;
    private String description;

}
