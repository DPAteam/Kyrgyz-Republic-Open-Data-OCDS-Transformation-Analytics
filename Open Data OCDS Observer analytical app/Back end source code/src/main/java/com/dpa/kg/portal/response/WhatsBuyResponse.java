package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class WhatsBuyResponse {

    private List<StringLong> competitiveAmountByRegion;
    private List<StringLong> nonCompetitiveAmountByRegion;
    private List<Region> top10CpvByRegion = new ArrayList<>();

    @Data
    public static class Region {
        private String name;
        private List<StringLong> cpvs;
    }

}
