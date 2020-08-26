package com.datapath.kg.common.validation;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class ValidationReport {

    @Id
    private String id;
    private String date;
    private PlanningReport planning;
    private TendersReport tenders;
    private ContractsReport contracts;

}
