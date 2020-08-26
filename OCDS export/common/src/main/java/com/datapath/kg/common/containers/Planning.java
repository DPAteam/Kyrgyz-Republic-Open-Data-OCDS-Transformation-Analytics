package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
public class Planning {

    @Field("id")
    private int id;
    private Integer budgetYear;
    private String dateCreated;
    private String dateChanged;
    private String status;
    private String type;

    private Value value;
    private ProcuringEntity buyer;
    private List<Plan> plans;


}
