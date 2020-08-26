package com.datapath.kg.exporter.catalogs.dao;

import com.datapath.kg.exporter.catalogs.CatalogQueryProvider;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CatalogDAOService {

    private final CatalogQueryProvider queryProvider;
    private final JdbcTemplate jdbcTemplate;

    public List<CurrencyRateDAO> getRates() {
        return jdbcTemplate.query(queryProvider.getRates(), new BeanPropertyRowMapper<>(CurrencyRateDAO.class));
    }

    public List<LegalFormDAO> getLegalForms() {
        return jdbcTemplate.query(queryProvider.getLegalForms(), new BeanPropertyRowMapper<>(LegalFormDAO.class));
    }

}
