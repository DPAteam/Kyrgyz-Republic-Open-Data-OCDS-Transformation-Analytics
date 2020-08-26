package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AwardDAO {

    private Long id;
    private String status;
    private String relatedLot;
    private Integer relatedBid;
    private LocalDateTime date;
    private BigDecimal valueAmount;
    private String valueCurrency;

}
