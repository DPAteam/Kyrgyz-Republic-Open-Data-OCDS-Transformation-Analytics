package com.dpa.kg.portal.dao;

import com.dpa.kg.portal.dao.containers.BuyerActivityDAO;
import com.dpa.kg.portal.dao.containers.LongValueDAO;
import com.dpa.kg.portal.dao.containers.MonthComplaintDAO;
import com.dpa.kg.portal.response.*;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

import static com.dpa.kg.portal.dao.MongoDAO.TENDERING_COLLECTION;

@Component
@AllArgsConstructor
public class StatisticDAOImpl implements StatisticDAO {

    private final MongoTemplate mongoTemplate;
    private final QueryBuilder queryBuilder;

    @Override
    public List<LongDate> getPublishedTendersCountByMonth(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getPublishedTendersCountByMonth(from, to),
                TENDERING_COLLECTION,
                LongDate.class
        ).getMappedResults();
    }

    @Override
    public List<DoubleDate> getCompletedLotsAmountByMonth(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getCompletedLotsAmountByMonth(from, to),
                TENDERING_COLLECTION, DoubleDate.class).getMappedResults();
    }

    @Override
    public LongValueDAO getAvgSupplierCompletedLots(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getAvgSupplierCompletedLots(from, to),
                TENDERING_COLLECTION,
                LongValueDAO.class)
                .getUniqueMappedResult();

    }

    @Override
    public List<LongDate> getAvgSupplierCompletedLotsByMonth(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getAvgSupplierCompletedLotsByMonth(from, to),
                TENDERING_COLLECTION,
                LongDate.class).getMappedResults();

    }

    @Override
    public List<BuyerActivityDAO> getBuyersActivity(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getBuyersActivity(from, to),
                TENDERING_COLLECTION,
                BuyerActivityDAO.class).getMappedResults();
    }

    @Override
    public List<MostPopularCPV> getMostPopularCPVsByCount(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getMostPopularCPVByLotsCount(from, to),
                TENDERING_COLLECTION,
                MostPopularCPV.class).getMappedResults();
    }

    @Override
    public List<MostPopularCPVByAmount> getMostPopularCPVsByAmount(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getMostPopularCPVByLotsAmount(from, to),
                TENDERING_COLLECTION,
                MostPopularCPVByAmount.class).getMappedResults();
    }

    @Override
    public List<ProcurementMethod> getProcurementMethodsAmountByDate(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getProcurementMethodsAmountByDate(from, to),
                TENDERING_COLLECTION,
                ProcurementMethod.class).getMappedResults();
    }

    @Override
    public List<Cpv> getTop5Cpv(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getTop5Cpv(from, to),
                TENDERING_COLLECTION,
                Cpv.class).getMappedResults();
    }

    @Override
    public List<LongDate> getDepartmentEnquiriesCountByMonth(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getDepartmentEnquiriesCountByMonth(from, to),
                TENDERING_COLLECTION,
                LongDate.class).getMappedResults();
    }

    @Override
    public List<LongDate> getCompanyEnquiriesCountByMonth(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getCompanyEnquiriesCountByMonth(from, to),
                TENDERING_COLLECTION,
                LongDate.class).getMappedResults();
    }

    @Override
    public List<Buyer> getTop5Buyers(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getTop5Buyers(from, to),
                TENDERING_COLLECTION,
                Buyer.class).getMappedResults();
    }

    @Override
    public List<StringLong> getComplaintStatuses(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getComplaintStatuses(from, to),
                TENDERING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public List<MonthComplaintDAO> getComplaintStatusesByMonth(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getComplaintStatusesByMonth(from, to),
                TENDERING_COLLECTION,
                MonthComplaintDAO.class).getMappedResults();
    }

    @Override
    public ProcurementMethodDistribution getProcurementMethodDistribution(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getProcurementMethodDistribution(from, to),
                TENDERING_COLLECTION,
                ProcurementMethodDistribution.class).getUniqueMappedResult();
    }

    @Override
    public List<StringLong> getQualificationRequirementTypes(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getQualificationRequirementTypes(from, to),
                TENDERING_COLLECTION,
                StringLong.class).getMappedResults();
    }

    @Override
    public LongValueDAO getResidentSuppliersCount(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getResidentSuppliersCount(from, to),
                TENDERING_COLLECTION,
                LongValueDAO.class)
                .getUniqueMappedResult();
    }

    @Override
    public LongValueDAO getNonResidentSuppliersCount(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getNonResidentSuppliersCount(from, to),
                TENDERING_COLLECTION,
                LongValueDAO.class)
                .getUniqueMappedResult();
    }

    @Override
    public LongValueDAO getCapitalBuyersCount(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getCapitalBuyersCount(from, to),
                TENDERING_COLLECTION,
                LongValueDAO.class)
                .getUniqueMappedResult();
    }

    @Override
    public LongValueDAO getNonCapitalBuyersCount(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(queryBuilder.getNonCapitalBuyersCount(from, to),
                TENDERING_COLLECTION,
                LongValueDAO.class)
                .getUniqueMappedResult();
    }

    @Override
    public List<ProcurementMethodAmounts> getCompetition(LocalDate from, LocalDate to) {
        return mongoTemplate.aggregate(
                queryBuilder.getCompetition(from, to),
                TENDERING_COLLECTION,
                ProcurementMethodAmounts.class).getMappedResults();
    }

}
