package com.datapath.kg.site.dto;

import com.datapath.kg.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BucketListDTO {
    private LocalDate date;
    private List<TenderIndicatorsCommonInfo> tenders;
}
