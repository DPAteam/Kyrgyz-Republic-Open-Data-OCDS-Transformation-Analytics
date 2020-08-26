package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class ProcuringEntity {


    @Field("id")
    private String id;
    private String name;

}
