package com.datapath.kg.exporter.catalogs;

import com.datapath.kg.common.containers.CurrencyRate;
import com.datapath.kg.exporter.EntityMapper;
import com.datapath.kg.exporter.catalogs.dao.CatalogDAOService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Component
@AllArgsConstructor
public class CurrencyRateReceiver {

    private final CatalogDAOService dao;
    private final EntityMapper entityMapper;

    public List<CurrencyRate> receive() {
        return dao.getRates().stream().map(entityMapper::map).collect(toList());
    }

}
