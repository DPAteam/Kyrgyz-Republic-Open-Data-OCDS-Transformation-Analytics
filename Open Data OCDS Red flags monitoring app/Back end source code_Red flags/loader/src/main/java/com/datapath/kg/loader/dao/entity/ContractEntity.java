package com.datapath.kg.loader.dao.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.time.OffsetDateTime;

import static javax.persistence.FetchType.LAZY;

@Data
@Entity(name = "contract")
@EqualsAndHashCode(of = "outerId")
public class ContractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String outerId;
    private OffsetDateTime dateSigned;
    private String contractNumber;
    private Double valueAmount;

    @ManyToOne(cascade = CascadeType.ALL, fetch = LAZY)
    @JoinColumn(name = "tender_id")
    private TenderEntity tender;

}
