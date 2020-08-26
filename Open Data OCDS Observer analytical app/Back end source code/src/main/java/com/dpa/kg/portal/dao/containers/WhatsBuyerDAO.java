package com.dpa.kg.portal.dao.containers;

import com.dpa.kg.portal.response.StringLong;
import lombok.Data;

import java.util.List;

@Data
public class WhatsBuyerDAO {

    private List<StringLong> competitiveAmountByRegion;
    private List<StringLong> nonCompetitiveAmountByRegion;
    private List<Cpv> top10Cpv;

    @Data
    public static class Cpv {
        private String region;
        private String cpv;
        private Long amount;
    }

}

