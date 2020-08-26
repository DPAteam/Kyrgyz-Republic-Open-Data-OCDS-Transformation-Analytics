package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class BidsDTO {

    private List<BidDetailDTO> details;
}
