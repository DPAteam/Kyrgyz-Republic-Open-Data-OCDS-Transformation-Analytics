package com.dpa.kg.portal.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class Buyer {

    private String id;
    private String name;
    private String region;
    private Double lotsAmount;
    private Long lotsCount;

}
