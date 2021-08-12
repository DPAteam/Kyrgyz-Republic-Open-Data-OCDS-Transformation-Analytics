package com.datapath.kg.loader.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EnquiryDTO {

    private Integer id;
    private OffsetDateTime dateAnswered;
    private OffsetDateTime date;
}
