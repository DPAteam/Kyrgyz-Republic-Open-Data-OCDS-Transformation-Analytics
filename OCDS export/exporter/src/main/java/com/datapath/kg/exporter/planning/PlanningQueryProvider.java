package com.datapath.kg.exporter.planning;

import lombok.Data;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

import static java.nio.charset.Charset.defaultCharset;
import static org.springframework.util.StreamUtils.copyToString;

/**
 * SQL query provider for getting plannings
 */

@Component
@Data
public class PlanningQueryProvider {

    private String eventsQuery;
    private String planningQuery;
    private String plansQuery;
    private String itemsQuery;
    private String partiesQuery;

    @PostConstruct
    private void init() throws IOException {
        eventsQuery = read("sql/planning/events.sql");
        planningQuery = read("sql/planning/planning.sql");
        plansQuery = read("sql/planning/plans.sql");
        itemsQuery = read("sql/planning/items.sql");
        partiesQuery = read("sql/planning/parties.sql");
    }

    private String read(String path) throws IOException {
        return copyToString(new ClassPathResource(path).getInputStream(), defaultCharset());
    }

}
