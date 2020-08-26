package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class DocumentDTO {
    private Integer id;
    private List<Integer> relatedLots;
    private List<Integer> relatedItems;
}
