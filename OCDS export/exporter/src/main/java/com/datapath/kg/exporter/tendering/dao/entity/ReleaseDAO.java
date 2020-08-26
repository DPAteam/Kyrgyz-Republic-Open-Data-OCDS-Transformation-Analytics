package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.util.List;

@Data
public class ReleaseDAO {

    private boolean contractBased;
    private TenderDAO tender;
    private List<ComplaintDAO> complaints;
    private List<BidDetailDAO> bids;
    private List<PartyDAO> parties;
    private List<ContractDAO> contracts;
    private List<AwardDAO> awards;
    private List<RelatedProcessDAO> relatedProcesses;
    private BudgetDAO budget;

}
