package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class BidDetail {

    @Field("id")
    private String id;
    private String status;
    private OffsetDateTime date;
    private List<PriceProposal> priceProposal;
    private List<Lot> relatedLots;
    private List<Party> tenderers;

}
