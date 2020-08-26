package com.datapath.kg.elasticsearchintegration.domain.charts;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class KPICharts {

    private List<String> dates = new ArrayList<>();
    private List<Long> checkedProceduresCount = new ArrayList<>();
    private List<Double> checkedProceduresAmount = new ArrayList<>();
    private List<Long> riskedProceduresCount = new ArrayList<>();
    private List<Double> riskedProceduresAmount = new ArrayList<>();
    private List<Double> partsRiskedProceduresCount = new ArrayList<>();
    private List<Double> partsRiskedProceduresAmount = new ArrayList<>();
    private List<Double> allProceduresAmount = new ArrayList<>();
    private List<Long> allProceduresCount = new ArrayList<>();
}
