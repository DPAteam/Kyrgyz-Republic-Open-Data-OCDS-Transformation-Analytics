package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class StatisticResponse {

    private long publishedTendersCount;
    private List<LongDate> publishedTendersCountByMonth;
    private double completedLotsAmount;
    private List<DoubleDate> completedLotsAmountByMonth;
    private Long avgLotsCountPerSupplier;
    private List<LongDate> avgLotsCountPerSupplierByMonth;

    private List<StringLong> buyerGeography;
    private List<CountryAmount> supplierGeography;

    private List<MostPopularCPV> mostPopularCPVsByCount;
    private List<MostPopularCPVByAmount> mostPopularCPVsByAmount;
    private List<ProcurementMethod> procurementMethodsAmountByDate;
    private ProcurementMethodDistribution procurementMethodDistribution;
    private List<Cpv> top5Cpv;

    private Long departmentEnquiriesCount;
    private List<LongDate> departmentEnquiriesCountByMonth;
    private Long companyEnquiriesCount;
    private List<LongDate> companyEnquiriesCountByMonth;
    private List<Buyer> top5BuyersWithCompetitiveTenders;
    private List<StringLong> complaintStatuses;
    private List<MonthComplaints> complaintStatusesByMonth;
    private BuyersActivity buyersActivity;
    private List<StringLong> top5QualificationRequirements;
    private List<StringLong> qualificationRequirementsDistribution;

    private Long residentSuppliersCount;
    private Long nonResidentSuppliersCount;

    private Long capitalBuyersCount;
    private Long nonCapitalBuyersCount;
    private List<ProcurementMethodAmounts> competition;

    //mock
    private Long completedLotsPercentage;
    private List<LongDate> completedLotsPercentageByMonth;
    private Integer completedLotsCountPer10SuppliersPercent;
    private Integer completedLotsAmountPer10SuppliersPercent;
    private Integer avgEnquiriesCount;
    private Integer avgBuyerCpvCount;
    private Integer avgTendersCount;
    private Integer repeatedTendersPercentage;


    public StatisticResponse() {

        List<LongDate> longByDates = new ArrayList<>();
        longByDates.add(new LongDate("2020-01", 3L));
        longByDates.add(new LongDate("2020-02", 2L));
        longByDates.add(new LongDate("2020-03", 4L));
        longByDates.add(new LongDate("2020-04", 1L));
        longByDates.add(new LongDate("2020-05", 7L));
        longByDates.add(new LongDate("2020-06", 14L));

        completedLotsPercentage = 10L;
        completedLotsPercentageByMonth = longByDates;

        completedLotsCountPer10SuppliersPercent = 72;
        completedLotsAmountPer10SuppliersPercent = 68;

        avgEnquiriesCount = 3;
        avgBuyerCpvCount = 11;
        avgTendersCount = 1209;
        repeatedTendersPercentage = 3;
    }
}
