package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class BidDetailDTO {
    private Integer id;
    private String status;
    private List<LotDTO> relatedLots;
    private List<PriceProposalDTO> priceProposal;
    private List<TendererDTO> tenderers;
}
