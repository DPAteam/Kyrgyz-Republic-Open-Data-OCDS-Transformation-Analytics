package com.dpa.kg.portal.dao.containers;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BuyerDAO {

    private String id;
    private String name;
    private BigDecimal lotsAmount;

}
