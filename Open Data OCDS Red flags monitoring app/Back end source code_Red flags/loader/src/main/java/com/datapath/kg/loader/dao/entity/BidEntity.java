package com.datapath.kg.loader.dao.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

import static javax.persistence.FetchType.LAZY;

@Data
@Entity(name = "bid")
@EqualsAndHashCode(of = "id")
public class BidEntity {

    @Id
    private Integer id;
    private String status;
    private Integer bidderId;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "bid", orphanRemoval = true)
    private Set<BidLotEntity> bidLots = new HashSet<>();

    @ManyToOne(cascade = CascadeType.ALL, fetch = LAZY)
    @JoinColumn(name = "tender_id")
    private TenderEntity tender;

    @OneToMany(mappedBy = "bid", cascade = CascadeType.ALL)
    private Set<PriceProposalEntity> priceProposal = new HashSet<>();

    @Transient
    private String tendererId;
}
