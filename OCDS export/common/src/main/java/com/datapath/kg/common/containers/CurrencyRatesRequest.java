package com.datapath.kg.common.containers;

import com.datapath.kg.common.containers.CurrencyRate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CurrencyRatesRequest {

    private List<CurrencyRate> rates;

}
