package com.dpa.kg.portal;

import lombok.Getter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;

import static java.nio.charset.StandardCharsets.UTF_8;

@Component
public class MappingHandler {

    public static final String COUNTRIES_PROPERTIES = "/countries.properties";
    public static final String CPV2_PROPERTIES = "/cpv2.properties";
    @Getter
    private Properties countries;
    private Properties cpv2;

    @PostConstruct
    public void init() throws IOException {
        countries = new Properties();
        countries.load(new InputStreamReader(new ClassPathResource(COUNTRIES_PROPERTIES).getInputStream(), UTF_8));

        cpv2 = new Properties();
        cpv2.load(new InputStreamReader(new ClassPathResource(CPV2_PROPERTIES).getInputStream(), UTF_8));
    }

    public String getCountryAlpha3(String name) {
        Object value = countries.get(name);
        return value == null ? "unknown" : value.toString();
    }

    public String getFullCpv2(String cpv2Prefix) {
        Object value = cpv2.get(cpv2Prefix);
        return value == null ? "unknown" : value.toString();
    }
}
