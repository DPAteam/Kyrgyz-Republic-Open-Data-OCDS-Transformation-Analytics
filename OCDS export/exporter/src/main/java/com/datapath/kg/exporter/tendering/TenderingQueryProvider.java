package com.datapath.kg.exporter.tendering;

import lombok.Getter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

import static java.nio.charset.Charset.defaultCharset;
import static org.springframework.util.StreamUtils.copyToString;

/**
 * Query provider for combining all tender parts
 */
@Component
@Getter
public class TenderingQueryProvider {

    private String tendersQuery;
    private String dailyTendersQuery;
    private String tenderQuery;
    private String conditionOfContractQuery;
    private String qualificationRequirementsQuery;
    private String complaintsQuery;
    private String complaintDocumentsQuery;
    private String itemsQuery;
    private String lotsQuery;
    private String bidsQuery;
    private String bidPriceProposalQuery;
    private String bidRelatedLotsQuery;
    private String partiesQuery;
    private String contractsQuery;
    private String oldContractsQuery;
    private String enquiriesQuery;
    private String documentsQuery;
    private String contractAwardIDsQuery;
    private String contractDeliveriesScheduleQuery;
    private String contractPaymentsSchedule;
    private String documentRelatedItems;
    private String documentRelatedLots;
    private String relatedProcessesQuery;
    private String budgetQuery;
    private String awardsQuery;

    @PostConstruct
    private void init() throws IOException {
        tenderQuery = read("sql/tendering/tender.sql");
        tendersQuery = read("sql/tendering/tenders.sql");
        dailyTendersQuery = read("sql/tendering/dailyTenders.sql");
        conditionOfContractQuery = read("sql/tendering/conditionOfContract.sql");
        qualificationRequirementsQuery = read("sql/tendering/qualificationRequirements.sql");
        complaintsQuery = read("sql/tendering/complaints.sql");
        complaintDocumentsQuery = read("sql/tendering/complaintDocuments.sql");
        itemsQuery = read("sql/tendering/items.sql");
        bidsQuery = read("sql/tendering/bids.sql");
        bidPriceProposalQuery = read("sql/tendering/bidPriceProposal.sql");
        bidRelatedLotsQuery = read("sql/tendering/bidsRelatedLots.sql");
        partiesQuery = read("sql/tendering/parties.sql");
        contractsQuery = read("sql/tendering/contracts.sql");
        oldContractsQuery = read("sql/tendering/oldContracts.sql");
        enquiriesQuery = read("sql/tendering/enquires.sql");
        documentsQuery = read("sql/tendering/documents.sql");
        contractAwardIDsQuery = read("sql/tendering/contractsAwardIDs.sql");
        contractDeliveriesScheduleQuery = read("sql/tendering/contractDeliverySchedules.sql");
        contractPaymentsSchedule = read("sql/tendering/contractPaymentsSchedule.sql");
        documentRelatedItems = read("sql/tendering/documentRelatedItems.sql");
        documentRelatedLots = read("sql/tendering/documentRelatedLots.sql");
        relatedProcessesQuery = read("sql/tendering/relatedProcesses.sql");
        lotsQuery = read("sql/tendering/lots.sql");
        budgetQuery = read("sql/tendering/budget.sql");
        awardsQuery = read("sql/tendering/awards.sql");
    }

    private String read(String path) throws IOException {
        return copyToString(new ClassPathResource(path).getInputStream(), defaultCharset());
    }

}
