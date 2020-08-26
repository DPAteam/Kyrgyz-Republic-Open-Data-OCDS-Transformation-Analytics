package com.datapath.kg.api.dao;

import com.datapath.kg.common.validation.ContractsReportData;
import com.datapath.kg.common.validation.PlanningReportData;
import com.datapath.kg.common.validation.TendersReportData;
import com.datapath.kg.common.validation.ValidationReport;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
@AllArgsConstructor
@Slf4j
public class ValidationDAOService {

    public static final String VALIDATION_FILE_NAME_PREFIX = "validation-";
    private final PlanningRepository planningRepository;
    private final MongoTemplate mongoTemplate;
    private final GridFsTemplate gridFsTemplate;
    private final ObjectMapper objectMapper;

    public PlanningReportData getPlanningReport() {
        Set<Integer> ids = planningRepository.getPlanIds();

        PlanningReportData data = new PlanningReportData();
        data.setCount(ids.size());
        data.setIds(ids);
        return data;
    }

    public TendersReportData getTendersReport() {

        List<Integer> tenders = mongoTemplate.findDistinct(
                new Query(where("tender.procurementMethod").ne("direct")),
                "tender.id", "tendering", Integer.class);

        List<Integer> contractBasedTenders = mongoTemplate.findDistinct(
                new Query(where("tender.procurementMethod").is("direct")),
                "tender.id", "tendering", Integer.class);

        TendersReportData data = new TendersReportData();
        data.setCount(tenders.size());
        data.setIds(tenders);

        data.setContractBasedCount(contractBasedTenders.size());
        data.setContractBasedIds(contractBasedTenders);
        return data;
    }

    public ContractsReportData getContractsReport() {

        List<String> contracts = mongoTemplate.findDistinct(
                new Query(where("contracts.procurementSubMethodDetails").ne("centralized")
                        .and("contracts.procurementMethod").ne("direct")),
                "contracts.id", "tendering", String.class);

        List<String> centralizedContracts = mongoTemplate.findDistinct(
                new Query(where("contracts.procurementSubMethodDetails").is("centralized")),
                "contracts.id", "tendering", String.class);

        List<String> contractBasedContracts = mongoTemplate.findDistinct(
                new Query(where("contracts.procurementMethod").is("direct")),
                "contracts.id", "tendering", String.class);

        ContractsReportData data = new ContractsReportData();
        data.setCount(contracts.size());
        data.setIds(contracts);

        data.setCentralizedCount(centralizedContracts.size());
        data.setCentralizedIds(centralizedContracts);

        data.setContractBasedCount(contractBasedContracts.size());
        data.setContractBasedIds(contractBasedContracts);

        return data;
    }

    public void saveReport(ValidationReport report) {
        try {
            ByteArrayInputStream inputStream = new ByteArrayInputStream(objectMapper.writeValueAsBytes(report));
            gridFsTemplate.store(inputStream, VALIDATION_FILE_NAME_PREFIX + LocalDate.now());
        } catch (Exception e) {
            log.error("An error occurred while saving validation report");
            log.error(e.getMessage(), e);
        }
    }

    public ValidationReport getReport(LocalDate date) {
        try {
            GridFsResource resource = gridFsTemplate.getResource(VALIDATION_FILE_NAME_PREFIX + date);
            return objectMapper.readValue(resource.getInputStream(), ValidationReport.class);
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException("Couldn't receive validation report", e);
        }
    }
}
