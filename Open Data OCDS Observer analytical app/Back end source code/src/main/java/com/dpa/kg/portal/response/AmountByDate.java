package com.dpa.kg.portal.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AmountByDate {

    private String date;
    private BigDecimal value;

}
