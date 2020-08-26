package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.List;

@Data
public class IndicatorsResponse {

    private List<String> activeDays;
    private List<Buyer> top10Buyers;
    private ProcurementMethodAmounts procurementMethodAmounts;
    private Long buyersCount;
    private Long suppliersCount;
    private Long completedLotsCount;
    private Long avgLotsCount;
    private List<LongDate> avgLotsCountByDate;
    private Long avgCpvCount;
    private List<DoubleDate> avgCpvCountByDates;
    private Double publishedLotsAmount;
    private List<AmountByDate> publishedLotsAmountByDate;
    private Long publishedLotsCount;
    private List<LongDate> publishedLotsCountByDate;
    private List<ProcurementMethodAmounts> competition;
    private WeekTender tenderOfWeek;
    private List<Procurement> topProcurements;
    private List<StringLong> top5CPV;
    private Long enquiriesCount;
    private List<LongDate> enquiriesCountByDate;


}
