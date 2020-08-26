package com.dpa.kg.portal.dao.containers;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProcurementMethodAmountsDAO {

    private String date;
    private BigDecimal competitiveLotsAmount;
    private BigDecimal notCompetitiveLotsAmount;


}
