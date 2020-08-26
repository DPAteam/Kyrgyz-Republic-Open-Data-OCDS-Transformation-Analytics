package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.List;

@Data
public class BuyersActivity {

    private List<LongDate> buyersCount;
    private List<LongDate> avgBuyerLotsCount;
    private List<LongDate> avgBuyerLotsAmount;

}
