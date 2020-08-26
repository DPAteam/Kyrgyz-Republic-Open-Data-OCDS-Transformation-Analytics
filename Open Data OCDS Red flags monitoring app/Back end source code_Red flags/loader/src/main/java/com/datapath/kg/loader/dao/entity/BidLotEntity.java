package com.datapath.kg.loader.dao.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity(name = "bid_lot")
@NoArgsConstructor
public class BidLotEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "bid_id")
    private BidEntity bid;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id")
    private LotEntity lot;

    private Double amount;

    public BidLotEntity(BidEntity bid, LotEntity lot, Double amount) {
        this.bid = bid;
        this.lot = lot;
        this.amount = amount;
    }
}
