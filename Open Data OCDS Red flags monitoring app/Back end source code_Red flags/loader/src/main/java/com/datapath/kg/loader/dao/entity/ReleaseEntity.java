package com.datapath.kg.loader.dao.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Data
@Entity(name = "release")
public class ReleaseEntity {

    @Id
    private String ocid;
    private String id;
    private String initiationType;
    private OffsetDateTime date;

    @OneToOne(mappedBy = "release", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private TenderEntity tender;

}
