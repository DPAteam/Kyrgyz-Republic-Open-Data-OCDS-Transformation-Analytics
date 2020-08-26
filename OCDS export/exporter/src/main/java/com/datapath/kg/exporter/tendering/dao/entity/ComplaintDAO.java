package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ComplaintDAO {

    private Integer id;
    private String status;
    private LocalDateTime dateSubmitted;
    private String type;
    private String complaintNumber;
    private String title;
    private String description;
    private Integer countryIsoCode;
    private String authorId;
    private LocalDateTime reviewDate;
    private LocalDateTime responseDate;
    private List<DocumentDAO> documents;
    private String resolution;
}
