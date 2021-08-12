package com.datapath.kg.loader.dao.service;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TenderDAOService {

    private JdbcTemplate template;

    private static final String UPDATE_BAD_QUALITY_QUERY = "update tender set bad_quality = true where id = ?";

    public void markAsBadQuality(Integer id) {
        template.update(UPDATE_BAD_QUALITY_QUERY, id);
    }
}
