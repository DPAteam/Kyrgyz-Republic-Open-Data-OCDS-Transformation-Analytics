package com.dpa.kg.portal.dao;


import org.springframework.data.mongodb.core.aggregation.Aggregation;

import java.time.LocalDate;
import java.util.List;

public interface QueryBuilder {

    Aggregation getActiveDays();

    Aggregation getPublishedTendersCountByMonth(LocalDate from, LocalDate to);

    Aggregation getCompletedLotsAmountByMonth(LocalDate from, LocalDate to);

    Aggregation getAvgSupplierCompletedLots(LocalDate from, LocalDate to);

    Aggregation getAvgSupplierCompletedLotsByMonth(LocalDate from, LocalDate to);

    Aggregation getBuyerGeography(LocalDate from, LocalDate to);

    Aggregation getSupplierGeography(LocalDate from, LocalDate to);

    Aggregation getCompletedLotsPercentage(LocalDate from, LocalDate to);

    Aggregation getMostPopularCPVByLotsCount(LocalDate from, LocalDate to);

    Aggregation getMostPopularCPVByLotsAmount(LocalDate from, LocalDate to);

    Aggregation getSuppliersCountries();

    Aggregation getSuppliersRegions();

    Aggregation getTop5Cpv(List<String> activeDays);

    Aggregation getEnquiriesCount(List<String> activeDays);

    Aggregation getEnquiriesCountByDate(List<String> activeDays);

    Aggregation getTop10NonResidentSupplierCountries();

    Aggregation getProcurementMethodsAmountByDate(LocalDate from, LocalDate to);

    Aggregation getTop5Cpv(LocalDate from, LocalDate to);

    Aggregation getDepartmentEnquiriesCountByMonth(LocalDate from, LocalDate to);

    Aggregation getCompanyEnquiriesCountByMonth(LocalDate from, LocalDate to);

    Aggregation getTop5Buyers(LocalDate from, LocalDate to);

    Aggregation getComplaintStatuses(LocalDate from, LocalDate to);

    Aggregation getComplaintStatusesByMonth(LocalDate from, LocalDate to);

    Aggregation getProcurementMethodDistribution(LocalDate from, LocalDate to);

    Aggregation getWhatsBuy(LocalDate from, LocalDate to);

    Aggregation getBuyersActivity(LocalDate from, LocalDate to);

    Aggregation getQualificationRequirementTypes(LocalDate from, LocalDate to);

    Aggregation getResidentSuppliersCount(LocalDate from, LocalDate to);

    Aggregation getNonResidentSuppliersCount(LocalDate from, LocalDate to);

    Aggregation getCapitalBuyersCount(LocalDate from, LocalDate to);

    Aggregation getNonCapitalBuyersCount(LocalDate from, LocalDate to);

    Aggregation getPlannedLotsAmountByRegion(Integer year);

    Aggregation getPlansAmountByRegion(Integer year);

    Aggregation getTop10CpvPlansByRegion(Integer year);

    Aggregation getTop10PlannedCpvByRegion(Integer year);

    Aggregation getTop10CpvPlans(Integer year);

    Aggregation getTop10PlannedCpv(Integer year);

    Aggregation getCompetition(LocalDate from, LocalDate to);
}
