package com.datapath.kg.persistence.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.OffsetDateTime;

@Data
@Entity(name = "release_persist_fail_history")
public class ReleasePersistFailHistoryEntity {

    @Id
    private String ocid;
    private String id;
    private String tenderNumber;
    private OffsetDateTime date;
    private OffsetDateTime failDate;

    private String exception;
    private String message;
    private String stackTrace;
}
