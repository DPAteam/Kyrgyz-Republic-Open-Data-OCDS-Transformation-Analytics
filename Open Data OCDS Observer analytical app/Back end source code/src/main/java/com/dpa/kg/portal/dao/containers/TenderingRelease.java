package com.dpa.kg.portal.dao.containers;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tendering")
public class TenderingRelease {

    @Id
    private String id;

}
