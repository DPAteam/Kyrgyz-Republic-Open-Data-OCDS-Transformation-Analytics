package com.datapath.kg.loader.dao.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.LAZY;

@Data
@Entity(name = "related_process")
    public class RelatedProcessEntity {

    @Id
    private String id;
    private Integer identifier;
    private String relationship;
    private String tenderNumber;

    @ManyToOne(cascade = ALL, fetch = LAZY)
    @JoinColumn(name = "tender_id")
    private TenderEntity tender;
}
