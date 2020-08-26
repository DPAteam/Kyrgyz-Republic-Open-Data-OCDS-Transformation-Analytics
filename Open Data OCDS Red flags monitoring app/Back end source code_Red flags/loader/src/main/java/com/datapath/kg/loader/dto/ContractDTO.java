package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class ContractDTO {

    private String id;
    private String dateSigned;
    private String contractNumber;
    private List<Long> awardIDs;
    private ValueDTO value;
}
