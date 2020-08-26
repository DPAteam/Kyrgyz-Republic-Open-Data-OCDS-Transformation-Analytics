package com.dpa.kg.portal.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class Procurement {

    private String buyer;
    private String supplier;
    private String cpv;
    private BigDecimal itemsAmount;
    private String contractNumber;

}
