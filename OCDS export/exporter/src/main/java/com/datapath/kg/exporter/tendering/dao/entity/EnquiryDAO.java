package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EnquiryDAO {

    private Long id;
    private LocalDateTime date;
    private String description;
    private String authorId;
    private Integer countryIsoCode;
    private LocalDateTime dateAnswered;
    private String answer;

}
