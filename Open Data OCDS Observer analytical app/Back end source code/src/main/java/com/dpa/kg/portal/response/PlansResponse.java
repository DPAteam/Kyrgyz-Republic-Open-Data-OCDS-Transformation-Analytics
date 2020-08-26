package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PlansResponse {

    private Long lotsAmountFromPlannedAmount;
    private List<Region> lotsAmountFromPlannedAmountByRegion = new ArrayList<>();
    private List<Cpv> countryTop10Planned = new ArrayList<>();
    private List<Region> top10PlannedByRegion = new ArrayList<>();

    @Data
    public static class Region {
        private String name;
        private long lotsAmount;
        private long plansAmount;
        private List<Cpv> cpvs;
        private long percent;
    }

    @Data
    public static class Cpv {
        private String name;
        private long planAmount;
        private long lotsAmount;
    }

}
