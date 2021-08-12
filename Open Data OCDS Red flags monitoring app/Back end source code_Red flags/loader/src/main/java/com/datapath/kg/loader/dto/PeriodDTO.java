package com.datapath.kg.loader.dto;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class PeriodDTO {
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
}
