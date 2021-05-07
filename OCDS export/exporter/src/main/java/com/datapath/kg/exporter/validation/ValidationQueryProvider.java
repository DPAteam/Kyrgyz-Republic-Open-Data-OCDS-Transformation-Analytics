package com.datapath.kg.exporter.validation;

import lombok.Getter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

import static java.nio.charset.Charset.defaultCharset;
import static org.springframework.util.StreamUtils.copyToString;

/**
 * Provider of sql queries to get different validation parts
 */
@Component
@Getter
public class ValidationQueryProvider {

    private String planningCountQuery;
    private String planningIdsQuery;

    private String contractsCountQuery;
    private String centralizedContractsCountQuery;
    private String contractBasedContractsCountQuery;

    private String contractIdsQuery;
    private String centralizedContractIdsQuery;
    private String contractBasedContractIdsQuery;

    private String tendersCountQuery;
    private String contractBasedTendersCountQuery;
    private String tenderIdsQuery;
    private String contractBasedTenderIdsQuery;

    @PostConstruct
    private void init() throws IOException {
        planningCountQuery = read("sql/validation/planning/planning-count.sql");
        planningIdsQuery = read("sql/validation/planning/planning-ids.sql");

        contractsCountQuery =  read("sql/validation/contracts/contracts-count.sql");
        centralizedContractsCountQuery =  read("sql/validation/contracts/centralized-contracts-count.sql");
        contractBasedContractsCountQuery =  read("sql/validation/contracts/contract-based-contracts-count.sql ");

        contractIdsQuery = read("sql/validation/contracts/contracts-ids.sql");
        centralizedContractIdsQuery = read("sql/validation/contracts/centralized-contract-ids.sql");
        contractBasedContractIdsQuery = read("sql/validation/contracts/contract-based-contract-ids.sql");

        tendersCountQuery = read("sql/validation/tenders/tenders-count.sql");
        contractBasedTendersCountQuery = read("sql/validation/tenders/contract-based-tenders-count.sql");
        tenderIdsQuery = read("sql/validation/tenders/tender-ids.sql");
        contractBasedTenderIdsQuery = read("sql/validation/tenders/contract-based-tender-ids.sql");
    }

    private String read(String path) throws IOException {
        return copyToString(new ClassPathResource(path).getInputStream(), defaultCharset());
    }

}
