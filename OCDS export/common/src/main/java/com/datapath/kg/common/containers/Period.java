package com.datapath.kg.common.containers;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class Period {

    private OffsetDateTime startDate;
    private OffsetDateTime endDate;

}
