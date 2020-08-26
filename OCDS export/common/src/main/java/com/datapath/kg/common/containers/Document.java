package com.datapath.kg.common.containers;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(exclude = "dateModified")
public class Document {

    @Field("id")
    private Long id;
    private String title;
    private OffsetDateTime dateCreated;
    private OffsetDateTime dateModified;

    private List<String> relatedLots;
    private List<Long> relatedItems;
}
