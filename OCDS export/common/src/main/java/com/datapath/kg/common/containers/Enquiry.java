package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;

@Data
public class Enquiry {

    @Field("id")
    private String id;
    private OffsetDateTime date;
    private String description;
    private Author author;
    private OffsetDateTime dateAnswered;
    private String answer;

}
