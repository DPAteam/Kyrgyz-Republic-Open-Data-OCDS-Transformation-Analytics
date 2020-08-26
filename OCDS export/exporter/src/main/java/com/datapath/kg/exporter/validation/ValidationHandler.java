package com.datapath.kg.exporter.validation;

import com.datapath.kg.common.validation.*;
import com.datapath.kg.exporter.ApiManager;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ValidationHandler  implements InitializingBean {

    private final ValidationProvider provider;
    private final ApiManager apiManager;



    @Scheduled(cron = "${validation.cron}")
    public void handle() {
        ValidationReport report = new ValidationReport();
        report.setPlanning(getPlanningReport());
        report.setContracts(getContractsReport());
        report.setTenders(getTendersReport());

        apiManager.saveValidationReport(report);
    }

    private TendersReport getTendersReport() {

        TendersReportData data = new TendersReportData();
        data.setCount(provider.getTenderCount());
        data.setContractBasedCount(provider.getContractBasedTendersCount());
        data.setIds(provider.getTenderIds());
        data.setContractBasedIds(provider.getContractBasedTenderIds());

        TendersReport report = new TendersReport();
        report.setSource(data);
        return report;
    }

    private ContractsReport getContractsReport() {

        ContractsReportData data = new ContractsReportData();

        data.setCount(provider.getContractsCount());
        data.setCentralizedCount(provider.getCentralizedContractsCount());
        data.setContractBasedCount(provider.getContractBasedContractsCount());

        data.setIds(provider.getContractsIds());
        data.setCentralizedIds(provider.getCentralizedContractIds());
        data.setContractBasedIds(provider.getContractBasedContractIds());

        ContractsReport report = new ContractsReport();
        report.setSource(data);
        return report;
    }

    private PlanningReport getPlanningReport() {

        PlanningReportData data = new PlanningReportData();
        data.setCount(provider.getPlanningCount());
        data.setIds(provider.getPlanningIds());

        PlanningReport report = new PlanningReport();
        report.setSource(data);
        return report;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        handle();
    }
}
