package com.datapath.kg.loader.dao.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.OffsetDateTime;

import static javax.persistence.FetchType.LAZY;

@Data
@Entity(name = "enquiry")
public class EnquiryEntity {

    @Id
    private Integer id;
    private OffsetDateTime date;
    private OffsetDateTime dateAnswered;

    @ManyToOne(cascade = CascadeType.ALL, fetch = LAZY)
    @JoinColumn(name = "tender_id")
    private TenderEntity tender;
}
