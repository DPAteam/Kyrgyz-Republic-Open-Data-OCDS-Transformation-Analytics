package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.util.List;

@Data
public class BidDetailDAO {

    private Integer id;
    private String status;
    private String date;
    private Integer countryIsoCode;
    private String tendererId;
    private List<PriceProposalDAO> priceProposal;
    private List<LotDAO> relatedLots;

}
