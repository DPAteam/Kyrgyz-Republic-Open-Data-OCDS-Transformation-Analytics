package com.dpa.kg.portal.dao;

import com.dpa.kg.portal.dao.containers.LongValueDAO;
import com.dpa.kg.portal.dao.containers.StringValueDAO;
import com.dpa.kg.portal.dao.containers.WhatsBuyerDAO;
import com.dpa.kg.portal.response.CountryAmount;
import com.dpa.kg.portal.response.Cpv;
import com.dpa.kg.portal.response.LongDate;
import com.dpa.kg.portal.response.StringLong;

import java.time.LocalDate;
import java.util.List;

public interface IndicatorsDAO {

    List<StringValueDAO> getActiveDays();

    List<CountryAmount> getSuppliersCountries();

    List<CountryAmount> getTop10NonResidentSupplierCountries();

    List<StringLong> getSuppliersRegions();

    List<StringLong> getTop5CPV(List<String> activeDays);

    LongValueDAO getEnquiriesCount(List<String> activeDays);

    List<LongDate> getEnquiriesCountByDate(List<String> activeDays);

    WhatsBuyerDAO getWhatsBuy(LocalDate from, LocalDate to);

    List<StringLong> getPlannedLotsAmountByRegion(Integer year);

    List<StringLong> getPlansAmountByRegion(Integer year);

    List<StringLong> getTop10CpvPlans(Integer year);

    List<StringLong> getTop10PlannedCpv(Integer year);

    List<Cpv> getTop10CpvPlansByRegion(Integer year);

    List<Cpv> getTop10PlannedCpvByRegion(Integer year);

}
