package com.datapath.kg.exporter.catalogs.dao;

import lombok.Data;

@Data
public class CurrencyRateDAO {
    private String date;
    private String rate;
    private String code;
    private String name;
}
