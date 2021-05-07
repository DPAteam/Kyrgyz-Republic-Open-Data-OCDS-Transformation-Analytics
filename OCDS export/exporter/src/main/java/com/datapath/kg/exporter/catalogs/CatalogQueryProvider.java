package com.datapath.kg.exporter.catalogs;

import lombok.Getter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

import static java.nio.charset.Charset.defaultCharset;
import static org.springframework.util.StreamUtils.copyToString;


/**
 * SQL query provider for getting catalog entities
 */


@Component
@Getter
public class CatalogQueryProvider {

    private String legalForms;
    private String rates;

    @PostConstruct
    private void init() throws IOException {
        legalForms = read("sql/catalogs/legalForms.sql");
        rates = read("sql/catalogs/rates.sql");
    }

    private String read(String path) throws IOException {
        return copyToString(new ClassPathResource(path).getInputStream(), defaultCharset());
    }

}
