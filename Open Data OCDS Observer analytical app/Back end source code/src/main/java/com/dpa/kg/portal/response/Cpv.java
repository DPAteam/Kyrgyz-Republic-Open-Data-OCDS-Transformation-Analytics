package com.dpa.kg.portal.response;

import lombok.Data;

@Data
public class Cpv {

    private String name;
    private Long lotsCount;
    private Long lotsAmount;
    private Double residentLotsAmount;
    private Double nonResidentLotsAmount;
    private String region;
    private Long amount;

}
