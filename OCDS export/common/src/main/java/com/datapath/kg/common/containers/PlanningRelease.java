package com.datapath.kg.common.containers;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "planning")
@JsonPropertyOrder({"ocid", "id", "date", "tag", "parties", "planning"})
public class PlanningRelease {

    private String ocid;
    private String id;
    @Indexed
    private String date;
    private List<String> tag;
    private List<Party> parties;
    private Planning planning;

}
