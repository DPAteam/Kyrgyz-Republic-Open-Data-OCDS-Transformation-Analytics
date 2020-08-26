package com.dpa.kg.portal.dao;

import com.dpa.kg.portal.dao.containers.*;
import com.dpa.kg.portal.response.CountryAmount;
import com.dpa.kg.portal.response.DoubleDate;
import com.dpa.kg.portal.response.StringLong;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class MongoDAO implements DAO {

    public static final String TENDERING_COLLECTION = "tendering";
    private MongoTemplate mongoTemplate;
    private final TenderingRepository repository;
    private final QueryBuilder queryBuilder;

    public List<BuyerDAO> getTop10Buyers(List<String> activeDays) {
        return repository.getTop10Buyers(activeDays);
    }

    @Override
    public ProcurementMethodAmountsDAO getProcurementMethodAmounts(List<String> activeDays) {
        return repository.getProcurementMethodAmounts(activeDays);
    }

    @Override
    public List<ProcurementMethodAmountsDAO> getCompetition(List<String> activeDays) {
        return repository.getCompetition(activeDays);
    }

    @Override
    public LongValueDAO getBuyersCount(List<String> activeDays) {
        return repository.getBuyersCount(activeDays);
    }

    @Override
    public LongValueDAO getSuppliersCount(List<String> activeDays) {
        return repository.getSuppliersCount(activeDays);
    }

    @Override
    public Optional<LongValueDAO> getCompletedLotsCount(List<String> activeDays) {
        return repository.getCompletedLotsCount(activeDays);
    }

    @Override
    public Optional<LongValueDAO> getAvgLotsCount(List<String> activeDays) {
        return repository.getAvgLotsCount(activeDays);
    }

    @Override
    public List<LongByDateDAO> getAvgLotsCountByDate(List<String> activeDays) {
        return repository.getAvgLotsCountByDate(activeDays);
    }

    @Override
    public Optional<LongValueDAO> getAvgCpvCount(List<String> activeDays) {
        return repository.getAvgCpvCount(activeDays);
    }

    @Override
    public List<DoubleDate> getAvgCpvCountByDate(List<String> activeDays) {
        return repository.getAvgCpvCountByDate(activeDays);
    }

    @Override
    public Optional<DoubleValueDAO> getPublishedLotsAmount(List<String> activeDays) {
        return repository.getPublishedLotsAmount(activeDays);
    }

    @Override
    public List<AmountByDateDAO> getPublishedLotsAmountPerDay(List<String> activeDays) {
        return repository.getPublishedLotsAmountPerDay(activeDays);
    }

    @Override
    public Optional<LongValueDAO> getPublishedLotsCount(List<String> activeDays) {
        return repository.getPublishedLotsCount(activeDays);
    }

    @Override
    public List<LongByDateDAO> getPublishedLotsCountByDate(List<String> activeDays) {
        return repository.getPublishedLotsCountByDate(activeDays);
    }

    @Override
    public WeekTenderDAO getTenderOfWeek(List<String> activeDays) {
        return repository.getTenderOfWeek(activeDays);
    }

    @Override
    public List<ProcurementDAO> getTopProcurements(List<String> activeDays) {
        return repository.getTop10Procurements(activeDays);
    }

    @Override
    public List<StringLong> getBuyerGeography(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getBuyerGeography(from, to),
                TENDERING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public List<CountryAmount> getSupplierGeography(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getSupplierGeography(from, to),
                TENDERING_COLLECTION,
                CountryAmount.class).getMappedResults();
    }

    @Override
    public List<String> getReleases(LocalDate from, LocalDate to) {
        Query query = new Query();
        query.addCriteria(Criteria.where("date").gte(from).lte(to));
        query.limit(100);
        return mongoTemplate.find(query, String.class, "tendering");
    }

}
