package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;


@Data
public class Complaint {

    @Field("id")
    private Integer id;
    private String status;
    private LocalDateTime dateSubmitted;
    private String type;
    private String complaintNumber;
    private String title;
    private String description;
    private Author author;
    private LocalDateTime reviewDate;
    private LocalDateTime responseDate;
    private List<Document> documents;
    private String resolution;

}
