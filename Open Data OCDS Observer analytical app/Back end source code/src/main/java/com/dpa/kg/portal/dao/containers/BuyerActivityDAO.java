package com.dpa.kg.portal.dao.containers;

import lombok.Data;

@Data
public class BuyerActivityDAO {

    private String date;
    private Long buyersCount;
    private Long lotsAmount;
    private Integer lotsCount;

}
