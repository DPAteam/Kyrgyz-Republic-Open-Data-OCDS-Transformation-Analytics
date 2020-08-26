package com.datapath.kg.common.containers;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class Value {
    private BigDecimal amount;
    private BigDecimal initialAmount;
    private BigDecimal reservedAmount;
    private BigDecimal savedAmount;
    private String currency;
    private BigDecimal amountDiscounted;

}