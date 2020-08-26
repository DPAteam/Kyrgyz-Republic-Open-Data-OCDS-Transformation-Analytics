package com.datapath.kg.exporter.planning;

import com.datapath.kg.exporter.planning.dao.entity.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

import static org.springframework.jdbc.core.BeanPropertyRowMapper.newInstance;

@Component
@AllArgsConstructor
@Slf4j
public class PlanningProvider {

    private PlanningQueryProvider queryProvider;
    private JdbcTemplate jdbcTemplate;

    List<PlanningEventDAO> getUnprocessedEvents() {
        log.info("Receiving unprocessed planning events");
        return jdbcTemplate.query(queryProvider.getEventsQuery(),
                new BeanPropertyRowMapper<>(PlanningEventDAO.class));
    }

    public PlanningDAO getPlanning(Integer id) {
        return jdbcTemplate.queryForObject(queryProvider.getPlanningQuery(), newInstance(PlanningDAO.class), id);
    }

    public List<PlanDAO> getPlans(Integer planningId) {
        return jdbcTemplate.query(queryProvider.getPlansQuery(), newInstance(PlanDAO.class), planningId);
    }

    public List<ItemDAO> getItems(int planId) {
        return jdbcTemplate.query(queryProvider.getItemsQuery(), newInstance(ItemDAO.class), planId, planId);
    }

    public List<PartyDAO> getParties(Integer planningHeaderId) {
        return jdbcTemplate.query(queryProvider.getPartiesQuery(), newInstance(PartyDAO.class), planningHeaderId);
    }

}
