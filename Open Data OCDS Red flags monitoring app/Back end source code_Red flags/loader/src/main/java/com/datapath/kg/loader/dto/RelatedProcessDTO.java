package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class RelatedProcessDTO {

    private Integer identifier;
    private String tenderNumber;
    private List<String> relationship;
}
