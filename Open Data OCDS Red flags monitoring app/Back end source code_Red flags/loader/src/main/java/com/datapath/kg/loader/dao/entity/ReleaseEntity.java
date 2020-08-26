package com.datapath.kg.loader.dao.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity(name = "release")
public class ReleaseEntity {

    @Id
    private String ocid;
    private String id;
    private String initiationType;
    private LocalDateTime date;

    @OneToOne(mappedBy = "release", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private TenderEntity tender;

}