package com.datapath.kg.loader.dto;

import lombok.Data;

@Data
public class LotDTO {

    private Integer id;
    private String status;
    private ValueDTO value;
    private String lotNumber;
}
