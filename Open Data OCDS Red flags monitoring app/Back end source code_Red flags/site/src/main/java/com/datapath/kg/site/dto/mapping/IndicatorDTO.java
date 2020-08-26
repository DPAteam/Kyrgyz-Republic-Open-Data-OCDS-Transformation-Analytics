package com.datapath.kg.site.dto.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class IndicatorDTO {

    private Integer id;
    private String name;
    private String description;
    private String descriptionEn;
    private String descriptionKg;
}
