package com.dpa.kg.portal.dao;

import com.dpa.kg.portal.dao.containers.BuyerActivityDAO;
import com.dpa.kg.portal.dao.containers.LongValueDAO;
import com.dpa.kg.portal.dao.containers.MonthComplaintDAO;
import com.dpa.kg.portal.response.*;

import java.time.LocalDate;
import java.util.List;

public interface StatisticDAO {

    List<LongDate> getPublishedTendersCountByMonth(LocalDate from, LocalDate to);

    List<DoubleDate> getCompletedLotsAmountByMonth(LocalDate from, LocalDate to);

    LongValueDAO getAvgSupplierCompletedLots(LocalDate from, LocalDate to);

    List<LongDate> getAvgSupplierCompletedLotsByMonth(LocalDate from, LocalDate to);

    List<BuyerActivityDAO> getBuyersActivity(LocalDate from, LocalDate to);

    List<MostPopularCPV> getMostPopularCPVsByCount(LocalDate from, LocalDate to);

    List<MostPopularCPVByAmount> getMostPopularCPVsByAmount(LocalDate from, LocalDate to);

    List<ProcurementMethod> getProcurementMethodsAmountByDate(LocalDate from, LocalDate to);

    List<Cpv> getTop5Cpv(LocalDate from, LocalDate to);

    List<LongDate> getDepartmentEnquiriesCountByMonth(LocalDate from, LocalDate to);

    List<LongDate> getCompanyEnquiriesCountByMonth(LocalDate from, LocalDate to);

    List<Buyer> getTop5Buyers(LocalDate from, LocalDate to);

    List<StringLong> getComplaintStatuses(LocalDate from, LocalDate to);

    List<MonthComplaintDAO> getComplaintStatusesByMonth(LocalDate from, LocalDate to);

    ProcurementMethodDistribution getProcurementMethodDistribution(LocalDate from, LocalDate to);

    List<StringLong> getQualificationRequirementTypes(LocalDate from, LocalDate to);

    LongValueDAO getResidentSuppliersCount(LocalDate from, LocalDate to);

    LongValueDAO getNonResidentSuppliersCount(LocalDate from, LocalDate to);

    LongValueDAO getCapitalBuyersCount(LocalDate from, LocalDate to);

    LongValueDAO getNonCapitalBuyersCount(LocalDate from, LocalDate to);

    List<ProcurementMethodAmounts> getCompetition(LocalDate from, LocalDate to);

}
