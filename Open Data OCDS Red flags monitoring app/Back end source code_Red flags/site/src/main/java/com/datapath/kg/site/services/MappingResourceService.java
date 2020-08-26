package com.datapath.kg.site.services;

import com.datapath.kg.persistence.entity.CpvEntity;
import com.datapath.kg.persistence.entity.IndicatorEntity;
import com.datapath.kg.persistence.repository.CpvRepository;
import com.datapath.kg.persistence.repository.IndicatorRepository;
import com.datapath.kg.site.dto.mapping.ValueWithTranslatedDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.datapath.kg.site.util.Constants.*;
import static java.util.Objects.isNull;
import static java.util.stream.Collectors.toMap;
import static org.springframework.util.StringUtils.isEmpty;

@Component
@Slf4j
public class MappingResourceService {

    private final java.util.Locale LOCALE_RU = new java.util.Locale(RU_LOCALE, "RU");
    private final java.util.Locale LOCALE_KY = new java.util.Locale(KY_LOCALE, "KY");

    private Map<Integer, String> riskIndicators;
    private Map<String, ValueWithTranslatedDTO> mappings;
    private Map<String, String> regionHashKeys;
    private Map<String, ValueWithTranslatedDTO> cpvItems;
    private Map<String, ValueWithTranslatedDTO> headers;

    private ResourceBundleMessageSource messageSource;
    private IndicatorRepository indicatorRepository;
    private CpvRepository cpvRepository;

    public MappingResourceService(ResourceBundleMessageSource messageSource,
                                  IndicatorRepository indicatorRepository,
                                  CpvRepository cpvRepository) {
        this.messageSource = messageSource;
        this.indicatorRepository = indicatorRepository;
        this.cpvRepository = cpvRepository;
    }

    @PostConstruct
    private void init() {
        riskIndicators = indicatorRepository.findAll()
                .stream()
                .collect(toMap(IndicatorEntity::getId, IndicatorEntity::getName));

        mappings = getTranslatedMappings()
                .stream()
                .collect(toMap(ValueWithTranslatedDTO::getValue, Function.identity()));

        cpvItems = cpvRepository.findAll()
                .stream()
                .collect(toMap(
                        CpvEntity::getCode,
                        cpv -> new ValueWithTranslatedDTO(cpv.getCode(), cpv.getName(), cpv.getNameEn(), null)
                ));

        headers = uploadHeaders();

        regionHashKeys = mappings.entrySet()
                .stream()
                .collect(Collectors.toMap(e -> e.getValue().getValueRu(), Map.Entry::getKey));
    }

    public String getCpvName(String cpv, String locale) {
        ValueWithTranslatedDTO value = cpvItems.get(cpv);

        if (isNull(value)) return "";

        return EN_LOCALE.equals(locale) ?
                isEmpty(value.getValueEn()) ?
                        value.getValueRu() :
                        value.getValueEn() :
                value.getValueRu();
    }

    public Map<String, ValueWithTranslatedDTO> getCpvItems() {
        return cpvItems;
    }

    public Map<String, ValueWithTranslatedDTO> getMappings() {
        return mappings;
    }

    public String getRiskIndicatorName(Integer id) {
        return riskIndicators.get(id);
    }

    public String getTranslatedHeader(String key, String locale) {
        return getTranslatedData(headers, key, locale);
    }

    public String getTranslatedMapping(String key, String locale) {
        return getTranslatedData(mappings, key, locale);
    }

    public String getRegionKey(String value) {
        return regionHashKeys.get(value);
    }

    private String getTranslatedData(Map<String, ValueWithTranslatedDTO> map, String key, String locale) {
        ValueWithTranslatedDTO data = map.get(key);
        String result;
        switch (locale) {
            case KY_LOCALE:
                result = data.getValueKy();
                break;
            case EN_LOCALE:
                result = data.getValueEn();
                break;
            default:
                result = data.getValueRu();
        }
        return result;
    }

    private Map<String, ValueWithTranslatedDTO> uploadHeaders() {
        Enumeration<String> keys = ResourceBundle.getBundle("header").getKeys();
        Map<String, ValueWithTranslatedDTO> headers = new HashMap<>();
        while (keys.hasMoreElements()) {
            String key = keys.nextElement();
            String ru = messageSource.getMessage(key, null, LOCALE_RU);
            String en = messageSource.getMessage(key, null, java.util.Locale.ENGLISH);
            String ky = messageSource.getMessage(key, null, LOCALE_KY);
            headers.put(key, new ValueWithTranslatedDTO(null, ru, en, ky));
        }
        return headers;
    }

    private List<ValueWithTranslatedDTO> getTranslatedMappings() {
        Enumeration<String> keys = ResourceBundle.getBundle("mapping").getKeys();
        List<ValueWithTranslatedDTO> mappings = new LinkedList<>();
        while (keys.hasMoreElements()) {
            String key = keys.nextElement();
            String ru = messageSource.getMessage(key, null, LOCALE_RU);
            String en = messageSource.getMessage(key, null, Locale.ENGLISH);
            String ky = messageSource.getMessage(key, null, LOCALE_KY);
            mappings.add(new ValueWithTranslatedDTO(key, ru, en, ky));
        }
        return mappings;
    }
}
