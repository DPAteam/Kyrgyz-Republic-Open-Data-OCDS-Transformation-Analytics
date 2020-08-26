package com.datapath.kg.exporter.tendering;

import com.datapath.kg.exporter.tendering.dao.entity.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.jdbc.core.BeanPropertyRowMapper.newInstance;
import static org.springframework.util.CollectionUtils.isEmpty;

//fixme move all bean property providers to configuration to speed up apps
//fixme review sql parameter name and parameter name

@Component
@AllArgsConstructor
@Slf4j
public class TenderingProvider {

    private JdbcTemplate jdbcTemplate;
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private TenderingQueryProvider queryProvider;

    public List<Integer> getTenders() {
        log.info("Receiving all tenders");
        return jdbcTemplate.queryForList(queryProvider.getTendersQuery(), Integer.class);
    }

    public List<Integer> getDailyTenders() {
        log.info("Receiving all daily  tenders");
        return jdbcTemplate.queryForList(queryProvider.getDailyTendersQuery(), Integer.class);
    }

    @Transactional
    public ReleaseDAO assembleRelease(Integer tenderId) {
        TenderDAO tender = getTender(tenderId);
        tender.setConditionOfContact(getConditionOfContract(tenderId));
        tender.setQualificationRequirements(getQualificationRequirements(tenderId));
        tender.setItems(getItems(tenderId));
        tender.setEnquiries(getEnquires(tenderId));
        List<DocumentDAO> documents = getDocuments(tenderId);
        documents.forEach(doc -> {

            List<Long> relatedItems = getDocRelatedItems(doc.getId());
            if (!isEmpty(relatedItems)) {
                doc.setRelatedItems(relatedItems);
            }

            List<Long> relatedLots = getDocRelatedLots(doc.getId());
            if (!isEmpty(relatedLots)) {
                doc.setRelatedLots(relatedLots);
            }
        });
        tender.setDocuments(documents);
        tender.setLots(getLots(tenderId));

        ReleaseDAO release = new ReleaseDAO();

        List<ComplaintDAO> complaints = getComplaints(tenderId);
        if (!isEmpty(complaints)) {
            release.setComplaints(complaints);
        }

        release.setBids(getBids(tenderId));
        release.setParties(getParties(tenderId));
        release.setTender(tender);
        release.setAwards(getAwards(tenderId));

        List<ContractDAO> contracts;
        if (tender.getDatePublished().getYear() > 2019) {
            contracts = getContracts(tenderId);
        } else {
            List<ContractDAO> oldContracts = getOldContracts(tenderId);
            contracts = oldContracts.isEmpty() ? getContracts(tenderId) : oldContracts;
        }

        contracts.forEach(contract -> contract.setAwardIDs(getContractAwardIDs(contract.getId())));
        contracts.forEach(contract -> contract.setDeliveriesSchedule(getDeliveriesSchedule(contract.getId())));
        contracts.forEach(contract -> contract.setPaymentsSchedule(getPaymentsSchedule(contract.getId())));
        release.setContracts(contracts);

        release.setRelatedProcesses(getRelatedProcesses(tenderId));
        release.setBudget(getBudget(tenderId));

        return release;
    }

    private BudgetDAO getBudget(Integer tenderId) {
        List<BudgetDAO> result = jdbcTemplate.query(queryProvider.getBudgetQuery(), newInstance(BudgetDAO.class), tenderId);
        return DataAccessUtils.singleResult(result);
    }

    private List<LotDAO> getLots(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getLotsQuery(), newInstance(LotDAO.class), tenderId);
    }

    private List<DeliveryScheduleDAO> getDeliveriesSchedule(Long contractId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getContractDeliveriesScheduleQuery(),
                new MapSqlParameterSource("contract_id", contractId),
                newInstance(DeliveryScheduleDAO.class)
        );
    }

    private List<PaymentScheduleDAO> getPaymentsSchedule(Long contractId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getContractPaymentsSchedule(),
                new MapSqlParameterSource("contract_id", contractId),
                newInstance(PaymentScheduleDAO.class)
        );
    }

    private TenderDAO getTender(Integer id) {
        return jdbcTemplate.queryForObject(queryProvider.getTenderQuery(), newInstance(TenderDAO.class), id);
    }

    private ConditionOfContractDAO getConditionOfContract(Integer tenderId) {
        List<ConditionOfContractDAO> result = jdbcTemplate.query(
                queryProvider.getConditionOfContractQuery(),
                newInstance(ConditionOfContractDAO.class),
                tenderId
        );
        return DataAccessUtils.singleResult(result);
    }

    private List<QualificationRequirementDAO> getQualificationRequirements(Integer tenderId) {
        return jdbcTemplate.query(
                queryProvider.getQualificationRequirementsQuery(),
                newInstance(QualificationRequirementDAO.class),
                tenderId
        );
    }

    private List<ComplaintDAO> getComplaints(Integer tenderId) {
        List<ComplaintDAO> complaints = jdbcTemplate.query(
                queryProvider.getComplaintsQuery(),
                newInstance(ComplaintDAO.class),
                tenderId
        );
        complaints.forEach(complaint -> complaint.setDocuments(getComplaintDocuments(complaint.getId())));
        return complaints;
    }

    private List<DocumentDAO> getComplaintDocuments(Integer complaintId) {
        return jdbcTemplate.query(
                queryProvider.getComplaintDocumentsQuery(),
                newInstance(DocumentDAO.class),
                complaintId
        );
    }

    private List<ItemDAO> getItems(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getItemsQuery(), newInstance(ItemDAO.class), tenderId);
    }

    private List<BidDetailDAO> getBids(Integer tenderId) {
        List<BidDetailDAO> bids = jdbcTemplate.query(
                queryProvider.getBidsQuery(),
                newInstance(BidDetailDAO.class),
                tenderId
        );
        bids.forEach(bid -> {

            List<PriceProposalDAO> priceProposal = getBidPriceProposal(bid.getId());
            if (!isEmpty(priceProposal)) {
                bid.setPriceProposal(priceProposal);
            }

            List<LotDAO> relatedLots = getBidRelatedLots(bid.getId());
            if (!isEmpty(relatedLots)) {
                bid.setRelatedLots(relatedLots);
            }
        });
        return bids;
    }

    private List<PriceProposalDAO> getBidPriceProposal(Integer bidId) {
        return jdbcTemplate.query(
                queryProvider.getBidPriceProposalQuery(), newInstance(PriceProposalDAO.class), bidId
        );
    }

    private List<LotDAO> getBidRelatedLots(Integer bidId) {
        return jdbcTemplate.query(queryProvider.getBidRelatedLotsQuery(), newInstance(LotDAO.class), bidId);
    }

    private List<PartyDAO> getParties(Integer tenderId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getPartiesQuery(),
                new MapSqlParameterSource("order_id", tenderId),
                newInstance(PartyDAO.class)
        );
    }

    private List<ContractDAO> getContracts(Integer tenderId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getContractsQuery(),
                new MapSqlParameterSource("order_id", tenderId),
                newInstance(ContractDAO.class)
        );
    }

    private List<ContractDAO> getOldContracts(Integer tenderId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getContractsQuery(),
                new MapSqlParameterSource("order_id", tenderId),
                newInstance(ContractDAO.class)
        );
    }

    private List<Long> getContractAwardIDs(Long contractId) {
        return namedParameterJdbcTemplate.queryForList(queryProvider.getContractAwardIDsQuery(), new MapSqlParameterSource("contract_id", contractId), Long.class);
    }

    private List<EnquiryDAO> getEnquires(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getEnquiriesQuery(), newInstance(EnquiryDAO.class), tenderId, tenderId);
    }

    private List<DocumentDAO> getDocuments(Integer tenderId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getDocumentsQuery(),
                new MapSqlParameterSource("tender_id", tenderId),
                newInstance(DocumentDAO.class)
        );
    }

    private List<Long> getDocRelatedLots(Long docId) {
        return jdbcTemplate.queryForList(queryProvider.getDocumentRelatedLots(), Long.class, docId);
    }

    private List<Long> getDocRelatedItems(Long docId) {
        return jdbcTemplate.queryForList(queryProvider.getDocumentRelatedItems(), Long.class, docId);
    }

    private List<RelatedProcessDAO> getRelatedProcesses(Integer tenderId) {
        return namedParameterJdbcTemplate.query(
                queryProvider.getRelatedProcessesQuery(),
                new MapSqlParameterSource("order_id", tenderId),
                newInstance(RelatedProcessDAO.class)
        );
    }

    private List<AwardDAO> getAwards(Integer tenderId) {
        return jdbcTemplate.query(queryProvider.getAwardsQuery(), new BeanPropertyRowMapper<>(AwardDAO.class), tenderId);
    }

}
