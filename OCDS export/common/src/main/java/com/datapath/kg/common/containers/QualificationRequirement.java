package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
public class QualificationRequirement {
    @Field("id")
    private String id;
    private String type;
    private String typeDetails;
}
