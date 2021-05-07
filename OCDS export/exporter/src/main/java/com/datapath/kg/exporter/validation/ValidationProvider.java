package com.datapath.kg.exporter.validation;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Provider for each objects used to combine full validation reports
 */
@Component
@AllArgsConstructor
public class ValidationProvider {

    private final JdbcTemplate jdbcTemplate;
    private final ValidationQueryProvider queryProvider;

    public Integer getPlanningCount() {
        return jdbcTemplate.queryForObject(queryProvider.getPlanningCountQuery(), Integer.class);
    }

    public List<Integer> getPlanningIds() {
        return jdbcTemplate.queryForList(queryProvider.getPlanningIdsQuery(), Integer.class);
    }

    public Integer getContractsCount() {
        return jdbcTemplate.queryForObject(queryProvider.getContractsCountQuery(), Integer.class);
    }

    public Integer getCentralizedContractsCount() {
        return jdbcTemplate.queryForObject(queryProvider.getCentralizedContractsCountQuery(), Integer.class);
    }

    public Integer getContractBasedContractsCount() {
        return jdbcTemplate.queryForObject(queryProvider.getContractBasedContractsCountQuery(), Integer.class);
    }

    public List<String> getContractsIds() {
        return jdbcTemplate.queryForList(queryProvider.getContractIdsQuery(), String.class);
    }

    public List<String> getContractBasedContractIds() {
        return jdbcTemplate.queryForList(queryProvider.getContractBasedContractIdsQuery(), String.class);
    }

    public List<String> getCentralizedContractIds() {
        return jdbcTemplate.queryForList(queryProvider.getCentralizedContractIdsQuery(), String.class);
    }

    public Integer getTenderCount() {
        return jdbcTemplate.queryForObject(queryProvider.getTendersCountQuery(), Integer.class);
    }

    public Integer getContractBasedTendersCount() {
        return jdbcTemplate.queryForObject(queryProvider.getContractBasedTendersCountQuery(), Integer.class);
    }

    public List<Integer> getTenderIds() {
        return jdbcTemplate.queryForList(queryProvider.getTenderIdsQuery(), Integer.class);
    }

    public List<Integer> getContractBasedTenderIds() {
        return jdbcTemplate.queryForList(queryProvider.getContractBasedTenderIdsQuery(), Integer.class);
    }

}
