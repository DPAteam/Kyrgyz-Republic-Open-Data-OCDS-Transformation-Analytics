package com.datapath.kg.common.containers;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class Identifier {

    @Field("id")
    private String id;
    private String scheme;
    private String legalName;
    @JsonProperty("legalName_kg")
    private String legalNameKg;
}
