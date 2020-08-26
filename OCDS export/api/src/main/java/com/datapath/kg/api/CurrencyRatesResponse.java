package com.datapath.kg.api;

import com.datapath.kg.common.containers.CurrencyRate;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CurrencyRatesResponse {

    private List<CurrencyRate> rates;

}
