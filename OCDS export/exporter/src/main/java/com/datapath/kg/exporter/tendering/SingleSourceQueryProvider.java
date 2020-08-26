package com.datapath.kg.exporter.tendering;

import lombok.Getter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

import static java.nio.charset.Charset.defaultCharset;
import static org.springframework.util.StreamUtils.copyToString;

@Component
@Getter
public class SingleSourceQueryProvider {

    private String tendersQuery;
    private String dailyTendersQuery;
    private String partiesQuery;
    private String awardsQuery;
    private String contractsQuery;
    private String contractAwardIDsQuery;
    private String contractPaymentsScheduleQuery;
    private String contractDeliveriesScheduleQuery;
    private String tenderQuery;
    private String lotsQuery;
    private String itemsQuery;

    @PostConstruct
    private void init() throws IOException {
        tendersQuery = read("sql/tendering-single-source/tenders.sql");
        dailyTendersQuery = read("sql/tendering-single-source/dailyTenders.sql");
        partiesQuery = read("sql/tendering-single-source/parties.sql");
        awardsQuery = read("sql/tendering-single-source/awards.sql");
        contractsQuery = read("sql/tendering-single-source/contracts.sql");
        contractAwardIDsQuery = read("sql/tendering-single-source/contractAwardIDs.sql");
        contractPaymentsScheduleQuery = read("sql/tendering-single-source/contractPaymentsSchedule.sql");
        contractDeliveriesScheduleQuery = read("sql/tendering-single-source/contractDeliveriesSchedule.sql");
        tenderQuery = read("sql/tendering-single-source/tender.sql");
        lotsQuery = read("sql/tendering-single-source/lots.sql");
        itemsQuery = read("sql/tendering-single-source/items.sql");
    }

    private String read(String path) throws IOException {
        return copyToString(new ClassPathResource(path).getInputStream(), defaultCharset());
    }

}
