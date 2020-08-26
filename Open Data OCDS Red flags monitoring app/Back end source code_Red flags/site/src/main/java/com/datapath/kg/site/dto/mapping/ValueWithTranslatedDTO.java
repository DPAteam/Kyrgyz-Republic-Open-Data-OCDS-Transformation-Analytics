package com.datapath.kg.site.dto.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ValueWithTranslatedDTO {

    private String value;
    private String valueRu;
    private String valueEn;
    private String valueKy;
}
