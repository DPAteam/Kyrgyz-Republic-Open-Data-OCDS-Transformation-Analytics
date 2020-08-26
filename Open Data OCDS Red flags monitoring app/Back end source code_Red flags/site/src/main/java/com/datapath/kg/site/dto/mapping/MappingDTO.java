package com.datapath.kg.site.dto.mapping;

import lombok.Data;

import java.util.List;

@Data
public class MappingDTO {

    private List<IndicatorDTO> indicators;
    private List<OkgzDTO> okgzList;
    private List<CpvDTO> cpvList;
    private List<ValueWithTranslatedDTO> translatedValues;
}
