package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.List;

@Data
public class ExplorationDay {

    private String date;
    private List<Buyer> top10Buyers;
    private ProcurementMethodAmounts procurementMethodAmounts;

}
