package com.dpa.kg.portal.response;

import lombok.Data;

@Data
public class MostPopularCPVByAmount {

    private String region;
    private String cpv;
    private Long lotsAmount;

}
