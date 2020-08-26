package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Plan {

    @Field("id")
    private int id;
    private String accountNumber;
    private String accountName;
    private String budgetLineID;
    private String budgetLineName;
    private LocalDateTime dateCreated;
    private Value value;
    private List<Item> items;

}
