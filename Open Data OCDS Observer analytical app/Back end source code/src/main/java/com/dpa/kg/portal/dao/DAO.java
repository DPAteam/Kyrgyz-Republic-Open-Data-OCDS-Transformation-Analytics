package com.dpa.kg.portal.dao;

import com.dpa.kg.portal.dao.containers.*;
import com.dpa.kg.portal.response.CountryAmount;
import com.dpa.kg.portal.response.DoubleDate;
import com.dpa.kg.portal.response.StringLong;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DAO {

    List<BuyerDAO> getTop10Buyers(List<String> activeDays);

    ProcurementMethodAmountsDAO getProcurementMethodAmounts(List<String> activeDays);

    List<ProcurementMethodAmountsDAO> getCompetition(List<String> activeDays);

    LongValueDAO getBuyersCount(List<String> activeDays);

    LongValueDAO getSuppliersCount(List<String> activeDays);

    Optional<LongValueDAO> getCompletedLotsCount(List<String> activeDays);

    Optional<LongValueDAO> getAvgLotsCount(List<String> activeDays);

    List<LongByDateDAO> getAvgLotsCountByDate(List<String> activeDays);

    Optional<LongValueDAO> getAvgCpvCount(List<String> activeDays);

    List<DoubleDate> getAvgCpvCountByDate(List<String> activeDays);

    Optional<DoubleValueDAO> getPublishedLotsAmount(List<String> activeDays);

    List<AmountByDateDAO> getPublishedLotsAmountPerDay(List<String> activeDays);

    Optional<LongValueDAO> getPublishedLotsCount(List<String> activeDays);

    List<LongByDateDAO> getPublishedLotsCountByDate(List<String> activeDays);

    WeekTenderDAO getTenderOfWeek(List<String> activeDays);

    List<ProcurementDAO> getTopProcurements(List<String> activeDays);

    List<StringLong> getBuyerGeography(LocalDate from, LocalDate to);

    List<CountryAmount> getSupplierGeography(LocalDate from, LocalDate to);

    List<String> getReleases(LocalDate from, LocalDate to);


}
