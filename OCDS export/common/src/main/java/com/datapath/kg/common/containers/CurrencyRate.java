package com.datapath.kg.common.containers;

import lombok.Data;

@Data
public class CurrencyRate {

    private String date;
    private String rate;
    private String code;
    private String name;

}
