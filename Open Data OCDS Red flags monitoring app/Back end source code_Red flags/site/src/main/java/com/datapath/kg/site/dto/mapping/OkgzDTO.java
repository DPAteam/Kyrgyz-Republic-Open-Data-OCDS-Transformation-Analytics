package com.datapath.kg.site.dto.mapping;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OkgzDTO {
    private String code;
    private String originalCode;
    private String name;
    private String nameEn;
    private String nameKg;
}
