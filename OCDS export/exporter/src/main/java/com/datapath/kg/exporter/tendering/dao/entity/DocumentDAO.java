package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class DocumentDAO {
    private Long id;
    private String title;
    private LocalDateTime dateCreated;

    private List<Long> relatedLots;
    private List<Long> relatedItems;

}
