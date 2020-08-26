package com.datapath.kg.elasticsearchintegration.domain.charts;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopRegion {
    private String name;
    private Double count;
    private Double withRiskCount;
}
