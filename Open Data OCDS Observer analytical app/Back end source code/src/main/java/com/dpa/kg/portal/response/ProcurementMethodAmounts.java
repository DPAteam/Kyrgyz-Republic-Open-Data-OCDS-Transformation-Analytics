package com.dpa.kg.portal.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcurementMethodAmounts {

    private String date;
    private BigDecimal competitiveLotsAmount;
    private BigDecimal notCompetitiveLotsAmount;

}
