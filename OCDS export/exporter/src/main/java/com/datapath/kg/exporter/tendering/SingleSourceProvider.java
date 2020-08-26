package com.datapath.kg.exporter.tendering;

import com.datapath.kg.exporter.tendering.dao.entity.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.jdbc.core.BeanPropertyRowMapper.newInstance;


//fixme Autowire row mappers (factory of mappers)
@Component
@Slf4j
public class SingleSourceProvider {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    @Autowired
    private SingleSourceQueryProvider queryProvider;

    public List<Integer> getTenders() {
        log.info("Receiving all tenders");
        return jdbcTemplate.queryForList(queryProvider.getTendersQuery(), Integer.class);
    }

    public List<Integer> getDailyTenders() {
        log.info("Receiving all dailt  tenders");
        return jdbcTemplate.queryForList(queryProvider.getDailyTendersQuery(), Integer.class);
    }

    @Transactional
    public ReleaseDAO assembleRelease(Integer tenderId) {
        ReleaseDAO release = new ReleaseDAO();
        release.setContractBased(true);

        release.setParties(getParties(tenderId));
        release.setAwards(getAwards(tenderId));
        TenderDAO tender = getTender(tenderId);
        tender.setLots(getLots(tenderId));
        tender.setItems(getItems(tenderId));
        release.setTender(tender);

        List<ContractDAO> contracts = getContracts(tenderId);
        contracts.forEach(contract -> contract.setAwardIDs(getContractAwardIDs(contract.getId())));
        contracts.forEach(contract -> contract.setPaymentsSchedule(getPaymentsSchedule(contract.getId())));
        contracts.forEach(contract -> contract.setDeliveriesSchedule(getDeliveriesSchedule(contract.getId())));
        release.setContracts(contracts);

        return release;
    }

    private List<ItemDAO> getItems(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getItemsQuery(), newInstance(ItemDAO.class), tenderId);
    }

    private List<LotDAO> getLots(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getLotsQuery(), newInstance(LotDAO.class), tenderId);
    }

    private TenderDAO getTender(Integer tenderId) {
        return jdbcTemplate.queryForObject(queryProvider.getTenderQuery(), new BeanPropertyRowMapper<>(TenderDAO.class), tenderId);
    }

    private List<PartyDAO> getParties(Integer tenderId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getPartiesQuery(),
                new MapSqlParameterSource("order_id", tenderId),
                new BeanPropertyRowMapper<>(PartyDAO.class)
        );
    }

    private List<AwardDAO> getAwards(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getAwardsQuery(), new BeanPropertyRowMapper<>(AwardDAO.class), tenderId);
    }

    private List<ContractDAO> getContracts(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getContractsQuery(), new BeanPropertyRowMapper<>(ContractDAO.class), tenderId);
    }

    private List<Long> getContractAwardIDs(Long contractId) {
        return jdbcTemplate.queryForList(queryProvider.getContractAwardIDsQuery(), Long.class, contractId);
    }

    private List<PaymentScheduleDAO> getPaymentsSchedule(Long contractId) {
        return jdbcTemplate.query(
                queryProvider.getContractPaymentsScheduleQuery(),
                new BeanPropertyRowMapper<>(PaymentScheduleDAO.class),
                contractId);
    }

    private List<DeliveryScheduleDAO> getDeliveriesSchedule(Long contractId) {
        return jdbcTemplate.query(
                queryProvider.getContractDeliveriesScheduleQuery(),
                new BeanPropertyRowMapper<>(DeliveryScheduleDAO.class),
                contractId);
    }

}
