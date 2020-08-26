package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class AwardDTO {

    private Integer id;
    private String date;
    private String status;
    private Integer relatedBid;
    private List<Integer> relatedLots;
    private ValueDTO value;
}