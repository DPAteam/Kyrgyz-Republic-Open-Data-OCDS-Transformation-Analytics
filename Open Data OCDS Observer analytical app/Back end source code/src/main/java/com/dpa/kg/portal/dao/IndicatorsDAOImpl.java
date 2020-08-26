package com.dpa.kg.portal.dao;

import com.dpa.kg.portal.dao.containers.LongValueDAO;
import com.dpa.kg.portal.dao.containers.StringValueDAO;
import com.dpa.kg.portal.dao.containers.WhatsBuyerDAO;
import com.dpa.kg.portal.response.CountryAmount;
import com.dpa.kg.portal.response.Cpv;
import com.dpa.kg.portal.response.LongDate;
import com.dpa.kg.portal.response.StringLong;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

import static com.dpa.kg.portal.dao.MongoDAO.TENDERING_COLLECTION;

@Component
public class IndicatorsDAOImpl implements IndicatorsDAO {

    public static final String PLANNING_COLLECTION = "planning";
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private QueryBuilder queryBuilder;
    @Autowired
    private TenderingRepository repository;

    @Override
    public List<StringValueDAO> getActiveDays() {
        return mongoTemplate.aggregate(
                queryBuilder.getActiveDays(),
                TENDERING_COLLECTION,
                StringValueDAO.class).getMappedResults();
    }

    @Override
    public List<CountryAmount> getSuppliersCountries() {
        return mongoTemplate.aggregate(
                queryBuilder.getSuppliersCountries(),
                TENDERING_COLLECTION,
                CountryAmount.class).getMappedResults();
    }

    @Override
    public List<CountryAmount> getTop10NonResidentSupplierCountries() {
        return mongoTemplate.aggregate(queryBuilder.getTop10NonResidentSupplierCountries(),
                TENDERING_COLLECTION,
                CountryAmount.class).getMappedResults();
    }

    @Override
    public List<StringLong> getSuppliersRegions() {
        return mongoTemplate.aggregate(
                queryBuilder.getSuppliersRegions(),
                TENDERING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public List<StringLong> getTop5CPV(List<String> activeDays) {
        return mongoTemplate.aggregate(
                queryBuilder.getTop5Cpv(activeDays),
                TENDERING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public WhatsBuyerDAO getWhatsBuy(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getWhatsBuy(from, to),
                TENDERING_COLLECTION,
                WhatsBuyerDAO.class).getUniqueMappedResult();
    }

    @Override
    public List<StringLong> getPlannedLotsAmountByRegion(Integer year) {
        return mongoTemplate.aggregate(
                queryBuilder.getPlannedLotsAmountByRegion(year),
                TENDERING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public List<StringLong> getPlansAmountByRegion(Integer year) {
        return mongoTemplate.aggregate(
                queryBuilder.getPlansAmountByRegion(year),
                PLANNING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public List<StringLong> getTop10CpvPlans(Integer year) {
        return mongoTemplate.aggregate(
                queryBuilder.getTop10CpvPlans(year),
                PLANNING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public List<StringLong> getTop10PlannedCpv(Integer year) {
        return mongoTemplate.aggregate(
                queryBuilder.getTop10PlannedCpv(year),
                TENDERING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public List<Cpv> getTop10CpvPlansByRegion(Integer year) {
        return mongoTemplate.aggregate(
                queryBuilder.getTop10CpvPlansByRegion(year),
                PLANNING_COLLECTION,
                Cpv.class).getMappedResults();
    }

    @Override
    public List<Cpv> getTop10PlannedCpvByRegion(Integer year) {
        return mongoTemplate.aggregate(
                queryBuilder.getTop10PlannedCpvByRegion(year),
                TENDERING_COLLECTION,
                Cpv.class).getMappedResults();
    }


    @Override
    public LongValueDAO getEnquiriesCount(List<String> activeDays) {
        return mongoTemplate.aggregate(
                queryBuilder.getEnquiriesCount(activeDays),
                TENDERING_COLLECTION,
                LongValueDAO.class).getUniqueMappedResult();
    }

    @Override
    public List<LongDate> getEnquiriesCountByDate(List<String> activeDays) {
        return mongoTemplate.aggregate(
                queryBuilder.getEnquiriesCountByDate(activeDays),
                TENDERING_COLLECTION,
                LongDate.class).getMappedResults();
    }

}
