package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Data
public class Party {
    @Field("id")
    private String id;
    private Identifier identifier;
    private Address address;
    private List<String> roles;
}
