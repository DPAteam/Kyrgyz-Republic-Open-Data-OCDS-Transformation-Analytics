package com.dpa.kg.portal.response;

import lombok.Data;

@Data
public class MostPopularCPV {

    private String region;
    private String cpv;
    private Long lotsCount;

}
