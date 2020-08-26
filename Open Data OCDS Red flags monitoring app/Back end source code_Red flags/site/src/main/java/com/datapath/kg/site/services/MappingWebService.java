package com.datapath.kg.site.services;

import com.datapath.kg.persistence.repository.IndicatorRepository;
import com.datapath.kg.persistence.repository.OkgzRepository;
import com.datapath.kg.site.dto.mapping.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class MappingWebService {

    private IndicatorRepository indicatorRepository;
    private OkgzRepository okgzRepository;
    private MappingResourceService mappingService;

    public MappingWebService(IndicatorRepository indicatorRepository,
                             OkgzRepository okgzRepository,
                             MappingResourceService mappingService) {
        this.indicatorRepository = indicatorRepository;
        this.okgzRepository = okgzRepository;
        this.mappingService = mappingService;
    }

    public MappingDTO get() {
        MappingDTO mapping = new MappingDTO();
        mapping.setIndicators(putIndicatorInfo());
        mapping.setOkgzList(putOkgzList());
        mapping.setCpvList(putCpvList());
        mapping.setTranslatedValues(putMappings());
        return mapping;
    }

    private List<OkgzDTO> putOkgzList() {
        return okgzRepository.findAll()
                .stream()
                .map(i -> new OkgzDTO(
                        i.getCode(),
                        i.getOriginalCode(),
                        i.getName(),
                        i.getNameEn(),
                        i.getNameKg())
                )
                .collect(toList());
    }

    private List<ValueWithTranslatedDTO> putMappings() {
        return new ArrayList<>(mappingService.getMappings().values());
    }

    private List<CpvDTO> putCpvList() {
        return mappingService.getCpvItems().values()
                .stream()
                .map(cpv -> new CpvDTO(cpv.getValue(), cpv.getValueRu(), cpv.getValueEn()))
                .collect(toList());
    }

    private List<IndicatorDTO> putIndicatorInfo() {
        return indicatorRepository.findAll()
                .stream()
                .map(i -> new IndicatorDTO(
                        i.getId(),
                        i.getName(),
                        i.getDescription(),
                        i.getDescriptionEn(),
                        i.getDescriptionKg())
                )
                .collect(toList());
    }
}
