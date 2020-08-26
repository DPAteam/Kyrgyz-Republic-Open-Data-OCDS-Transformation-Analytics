package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
public class RelatedProcess {

    private List<String> relationship;
    private String identifier;
    private String tenderNumber;
    @Field("id")
    private String id;
    private String scheme;

}
