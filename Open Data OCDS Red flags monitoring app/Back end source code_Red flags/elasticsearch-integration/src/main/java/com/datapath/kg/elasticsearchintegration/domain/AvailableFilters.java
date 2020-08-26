package com.datapath.kg.elasticsearchintegration.domain;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AvailableFilters {

    private List<KeyValueObject> procurementMethodDetails = new ArrayList<>();
    private List<KeyValueObject> statusDetails = new ArrayList<>();
    private List<KeyValueObject> itemCpv2 = new ArrayList<>();
    private List<KeyValueObject> itemCpv = new ArrayList<>();
    private List<KeyValueObject> buyers = new ArrayList<>();
    private List<KeyValueObject> buyerRegions = new ArrayList<>();
    private List<KeyValueObject> riskLevels = new ArrayList<>();
    private List<KeyValueObject> hasComplaints = new ArrayList<>();
    private List<KeyValueObject> withRisk = new ArrayList<>();
    private List<KeyValueObject> riskedIndicators = new ArrayList<>();
}
