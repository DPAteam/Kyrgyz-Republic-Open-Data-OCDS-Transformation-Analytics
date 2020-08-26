package com.dpa.kg.portal;

import com.dpa.kg.portal.dao.DAO;
import com.dpa.kg.portal.dao.IndicatorsDAO;
import com.dpa.kg.portal.dao.StatisticDAO;
import com.dpa.kg.portal.dao.containers.*;
import com.dpa.kg.portal.response.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.time.LocalDate;
import java.util.*;

import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
public class PortalWebService {

    public static final Locale RU_LOCALE = new Locale("RU");
    public static final Locale KY_LOCALE = new Locale("KY");
    private final DAO dao;
    private final Converter converter;
    private final ObjectMapper objectMapper;
    private final StatisticDAO statisticDAO;
    private final IndicatorsDAO indicatorsDAO;
    private final MappingHandler mappingHandler;
    private final ResourceBundleMessageSource messageSource;

    @Cacheable("indicators")
    public IndicatorsResponse getIndicators() {
        IndicatorsResponse response = new IndicatorsResponse();

        List<String> activeDays = indicatorsDAO.getActiveDays().stream().map(StringValueDAO::getValue).collect(toList());
        response.setActiveDays(activeDays);

        List<Buyer> top10Buyers = getTop10Buyers(activeDays);
        ProcurementMethodAmounts procurementMethodAmounts = getProcurementMethods(activeDays);

        response.setTop10Buyers(top10Buyers);
        response.setProcurementMethodAmounts(procurementMethodAmounts);

        LongValueDAO buyersCount = dao.getBuyersCount(activeDays);
        if (buyersCount != null) {
            response.setBuyersCount(buyersCount.getValue());
        }

        LongValueDAO suppliersCount = dao.getSuppliersCount(activeDays);
        if (suppliersCount != null) {
            response.setSuppliersCount(suppliersCount.getValue());
        }

        Optional<LongValueDAO> completedLotsCount = dao.getCompletedLotsCount(activeDays);
        completedLotsCount.ifPresent(longValueDAO -> response.setCompletedLotsCount(longValueDAO.getValue()));

        Optional<LongValueDAO> avgLotsCount = dao.getAvgLotsCount(activeDays);
        avgLotsCount.ifPresent(value -> response.setAvgLotsCount(avgLotsCount.get().getValue()));

        Optional<LongValueDAO> avgCpvCount = dao.getAvgCpvCount(activeDays);
        avgCpvCount.ifPresent(value -> response.setAvgCpvCount(avgCpvCount.get().getValue()));

        List<DoubleDate> avgCpvCountByDates = dao.getAvgCpvCountByDate(activeDays);
        response.setAvgCpvCountByDates(avgCpvCountByDates);

        List<LongByDateDAO> avgLotsCountByDateDAO = dao.getAvgLotsCountByDate(activeDays);
        List<LongDate> avgLotsCountByDate = converter.convertCountByDays(avgLotsCountByDateDAO);
        response.setAvgLotsCountByDate(avgLotsCountByDate);

        Optional<DoubleValueDAO> publishedLotsAmount = dao.getPublishedLotsAmount(activeDays);
        publishedLotsAmount.ifPresent(amount -> response.setPublishedLotsAmount(publishedLotsAmount.get().getValue()));

        List<AmountByDateDAO> lotsAmountPerDaysDAO = dao.getPublishedLotsAmountPerDay(activeDays);
        List<AmountByDate> lotsAmountPerDays = converter.convertDateAmounts(lotsAmountPerDaysDAO);
        response.setPublishedLotsAmountByDate(lotsAmountPerDays);

        Optional<LongValueDAO> publishedLotsCount = dao.getPublishedLotsCount(activeDays);
        publishedLotsCount.ifPresent(value -> response.setPublishedLotsCount(publishedLotsCount.get().getValue()));

        List<LongByDateDAO> publishedLotsCountByDateDAO = dao.getPublishedLotsCountByDate(activeDays);
        List<LongDate> publishedLotsCountByDate = converter.convertCountByDays(publishedLotsCountByDateDAO);
        response.setPublishedLotsCountByDate(publishedLotsCountByDate);

        WeekTenderDAO tenderOfWeekDAO = dao.getTenderOfWeek(activeDays);
        response.setTenderOfWeek(converter.convert(tenderOfWeekDAO));

        response.setCompetition(getCompetition(activeDays));

        List<ProcurementDAO> topProcurementsDAO = dao.getTopProcurements(activeDays);
        List<Procurement> topProcurements = converter.convertProcurements(topProcurementsDAO);
        response.setTopProcurements(topProcurements);

        List<StringLong> top5CPV = indicatorsDAO.getTop5CPV(activeDays);
        response.setTop5CPV(top5CPV);

        LongValueDAO enquiriesCount = indicatorsDAO.getEnquiriesCount(activeDays);
        if (enquiriesCount != null) {
            response.setEnquiriesCount(enquiriesCount.getValue());
        }

        List<LongDate> enquiriesCountByDate = indicatorsDAO.getEnquiriesCountByDate(activeDays);
        response.setEnquiriesCountByDate(enquiriesCountByDate);

        return response;
    }

    private List<Buyer> getTop10Buyers(List<String> days) {
        List<BuyerDAO> top10Buyers = dao.getTop10Buyers(days);
        return converter.convertBuyers(top10Buyers);
    }

    private ProcurementMethodAmounts getProcurementMethods(List<String> days) {
        ProcurementMethodAmountsDAO procurementMethodAmounts = dao.getProcurementMethodAmounts(days);
        return converter.convert(procurementMethodAmounts);
    }

    private List<ProcurementMethodAmounts> getCompetition(List<String> days) {
        List<ProcurementMethodAmountsDAO> competition = dao.getCompetition(days);
        return converter.convertProcurementMethods(competition);
    }

    //fixme rewrite and receive result for all data at one time
    @Cacheable("exploration")
    public ExplorationResponse getExploration() {
        List<String> activeDays = indicatorsDAO.getActiveDays().stream().map(StringValueDAO::getValue).collect(toList());

        ExplorationResponse exploration = new ExplorationResponse();
        activeDays.forEach(day -> {
            ExplorationDay explorationDay = new ExplorationDay();

            explorationDay.setDate(day);
            explorationDay.setTop10Buyers(getTop10Buyers(singletonList(day)));
            explorationDay.setProcurementMethodAmounts(getProcurementMethods(singletonList(day)));

            exploration.getDays().add(explorationDay);
        });
        return exploration;
    }

    @Cacheable("statistic")
    public StatisticResponse getStatistic(LocalDate from, LocalDate to) {
        StatisticResponse response = new StatisticResponse();


        List<LongDate> publishedTendersByDate = statisticDAO.getPublishedTendersCountByMonth(from, to);
        long publishedTendersCount = publishedTendersByDate.stream().mapToLong(LongDate::getValue).sum();
        response.setPublishedTendersCountByMonth(publishedTendersByDate);
        response.setPublishedTendersCount(publishedTendersCount);

        List<DoubleDate> completedLotsAmountByMonth = statisticDAO.getCompletedLotsAmountByMonth(from, to);
        double completedLotsAmount = completedLotsAmountByMonth.stream().mapToDouble(DoubleDate::getValue).sum();
        response.setCompletedLotsAmountByMonth(completedLotsAmountByMonth);
        response.setCompletedLotsAmount(completedLotsAmount);

        LongValueDAO avgSupplierCompletedLots = statisticDAO.getAvgSupplierCompletedLots(from, to);
        response.setAvgLotsCountPerSupplier(converter.convert(avgSupplierCompletedLots));

        List<LongDate> avgSupplierCompletedLotsByMonth = statisticDAO.getAvgSupplierCompletedLotsByMonth(from, to);
        response.setAvgLotsCountPerSupplierByMonth(avgSupplierCompletedLotsByMonth);


        List<StringLong> buyerGeography = dao.getBuyerGeography(from, to);
        response.setBuyerGeography(buyerGeography);

        List<CountryAmount> supplierGeography = dao.getSupplierGeography(from, to);
        supplierGeography.forEach(country -> {
            String alpha3 = mappingHandler.getCountryAlpha3(country.getName());
            country.setCode(alpha3);
        });

        response.setSupplierGeography(supplierGeography);

        List<MostPopularCPV> mostPopularCPVs = statisticDAO.getMostPopularCPVsByCount(from, to);
        response.setMostPopularCPVsByCount(mostPopularCPVs);

        List<MostPopularCPVByAmount> mostPopularCPVsByAmount = statisticDAO.getMostPopularCPVsByAmount(from, to);
        response.setMostPopularCPVsByAmount(mostPopularCPVsByAmount);

        List<ProcurementMethod> procurementMethodsAmount = statisticDAO.getProcurementMethodsAmountByDate(from, to);
        response.setProcurementMethodsAmountByDate(procurementMethodsAmount);

        List<Cpv> top5Cpv = statisticDAO.getTop5Cpv(from, to);
        // Map 2 signed value with full cpv
        top5Cpv.forEach(cpv -> cpv.setName(mappingHandler.getFullCpv2(cpv.getName())));
        response.setTop5Cpv(top5Cpv);

        List<LongDate> departmentEnquiriesCountByMonth = statisticDAO.getDepartmentEnquiriesCountByMonth(from, to);
        List<LongDate> companyEnquiriesCountByMonth = statisticDAO.getCompanyEnquiriesCountByMonth(from, to);
        long departmentEnquiriesCount = departmentEnquiriesCountByMonth.stream().mapToLong(LongDate::getValue).sum();
        long companyEnquiriesCount = companyEnquiriesCountByMonth.stream().mapToLong(LongDate::getValue).sum();

        response.setDepartmentEnquiriesCount(departmentEnquiriesCount);
        response.setCompanyEnquiriesCount(companyEnquiriesCount);
        response.setDepartmentEnquiriesCountByMonth(departmentEnquiriesCountByMonth);
        response.setCompanyEnquiriesCountByMonth(companyEnquiriesCountByMonth);

        List<Buyer> top5Buyers = statisticDAO.getTop5Buyers(from, to);
        response.setTop5BuyersWithCompetitiveTenders(top5Buyers);

        List<StringLong> complaintStatuses = statisticDAO.getComplaintStatuses(from, to);
        response.setComplaintStatuses(complaintStatuses);

        //TODO rewrite KISS
        Map<String, List<MonthComplaintDAO>> grouped = statisticDAO.getComplaintStatusesByMonth(from, to).stream().collect(groupingBy(MonthComplaintDAO::getDate));

        List<MonthComplaints> monthComplaints = new ArrayList<>();
        grouped.keySet().forEach(month -> {
            MonthComplaints monthComplaint = new MonthComplaints();
            monthComplaint.setDate(month);
            List<StringLong> statuses = grouped.get(month).stream().map(value -> new StringLong(value.getStatus(), value.getCount())).collect(toList());
            monthComplaint.setComplaintStatuses(statuses);

            monthComplaints.add(monthComplaint);
        });
        response.setComplaintStatusesByMonth(monthComplaints);

        ProcurementMethodDistribution procurementMethodDistribution = statisticDAO.getProcurementMethodDistribution(from, to);
        response.setProcurementMethodDistribution(procurementMethodDistribution);

        List<BuyerActivityDAO> buyerActivityDAO = statisticDAO.getBuyersActivity(from, to);
        BuyersActivity buyersActivity = converter.convert(buyerActivityDAO);
        response.setBuyersActivity(buyersActivity);

        List<StringLong> qualificationRequirementTypes = statisticDAO.getQualificationRequirementTypes(from, to);
        response.setTop5QualificationRequirements(qualificationRequirementTypes.stream().limit(5).collect(toList()));
        response.setQualificationRequirementsDistribution(qualificationRequirementTypes.stream().limit(5).collect(toList()));

        LongValueDAO residentSuppliersCount = statisticDAO.getResidentSuppliersCount(from, to);
        response.setResidentSuppliersCount(converter.convert(residentSuppliersCount));

        LongValueDAO nonResidentSuppliersCount = statisticDAO.getNonResidentSuppliersCount(from, to);
        response.setNonResidentSuppliersCount(converter.convert(nonResidentSuppliersCount));

        LongValueDAO capitalBuyersCount = statisticDAO.getCapitalBuyersCount(from, to);
        response.setCapitalBuyersCount(converter.convert(capitalBuyersCount));

        LongValueDAO nonCapitalBuyersCount = statisticDAO.getNonCapitalBuyersCount(from, to);
        response.setNonCapitalBuyersCount(converter.convert(nonCapitalBuyersCount));

        List<ProcurementMethodAmounts> competition = statisticDAO.getCompetition(from, to);
        response.setCompetition(competition);

        return response;
    }

    public String exportJson(LocalDate from, LocalDate to) {
        List<String> releases = dao.getReleases(from, to);
        try {
            ObjectNode root = objectMapper.createObjectNode();
            ArrayNode releasesArray = root.putArray("releases");
            for (String release : releases) {
                releasesArray.add(objectMapper.readTree(release));
            }
            return objectMapper.writeValueAsString(root);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public String exportCsv(LocalDate from, LocalDate to) {
        StringWriter writer = new StringWriter();

        List<String> releases = dao.getReleases(from, to);

        for (String release : releases) {
            StringBuilder csv = new StringBuilder();
            try {
                JsonNode jsonNode = objectMapper.readTree(release);
                jsonNode.fields().forEachRemaining(field -> {
                    csv.append(field.getValue()).append("\t");
                });
                writer.write(csv.toString());
                writer.write("\n");

            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }

        return writer.toString();
    }

    @Cacheable("international-participation")
    public InternationalParticipationResponse getInternationalParticipation() {

        InternationalParticipationResponse response = new InternationalParticipationResponse();

        List<CountryAmount> suppliersCountries = indicatorsDAO.getSuppliersCountries();
        suppliersCountries.forEach(country -> {
            String alpha3 = mappingHandler.getCountryAlpha3(country.getName());
            country.setCode(alpha3);
        });
        response.setSuppliersCountries(suppliersCountries);

        List<CountryAmount> top10NonResidentSupplierCountries = indicatorsDAO.getTop10NonResidentSupplierCountries();
        top10NonResidentSupplierCountries.forEach(country -> {
            String alpha3 = mappingHandler.getCountryAlpha3(country.getName());
            country.setCode(alpha3);
        });
        response.setTop10NonResidentSupplierCountries(top10NonResidentSupplierCountries);

        List<StringLong> suppliersRegions = indicatorsDAO.getSuppliersRegions();
        response.setSuppliersRegions(suppliersRegions);

        return response;
    }

    public I18nResponse getI18n() {
        I18nResponse response = new I18nResponse();

        Enumeration<String> keys = ResourceBundle.getBundle("i18n/messages").getKeys();
        while (keys.hasMoreElements()) {
            String key = keys.nextElement();
            String en = messageSource.getMessage(key, null, Locale.ENGLISH);
            String ru = messageSource.getMessage(key, null, RU_LOCALE);
            String ky = messageSource.getMessage(key, null, KY_LOCALE);

            response.getEntries().add(new I18Entry(key, ru, en, ky));
        }
        return response;
    }

    @Cacheable("whats-buy")
    public WhatsBuyResponse getWhatsBuy(LocalDate from, LocalDate to) {
        WhatsBuyResponse response = new WhatsBuyResponse();

        WhatsBuyerDAO whatsBuyDAO = indicatorsDAO.getWhatsBuy(from, to);
        Map<String, List<WhatsBuyerDAO.Cpv>> groupedByRegion = whatsBuyDAO.getTop10Cpv().stream().collect(groupingBy(WhatsBuyerDAO.Cpv::getRegion));
        groupedByRegion.keySet().forEach(regionName -> {
            List<StringLong> cpvs = groupedByRegion.get(regionName).
                    stream()
                    .sorted(Comparator.comparingLong(WhatsBuyerDAO.Cpv::getAmount).reversed())
                    .limit(10)
                    .map(daoCpv ->
                            new StringLong(daoCpv.getCpv(), daoCpv.getAmount())
                    )
                    .collect(toList());

            WhatsBuyResponse.Region region = new WhatsBuyResponse.Region();
            region.setName(regionName);
            region.setCpvs(cpvs);

            response.getTop10CpvByRegion().add(region);
        });

        List<StringLong> competitiveAmountByRegion = whatsBuyDAO.getCompetitiveAmountByRegion();
        List<StringLong> nonCompetitiveAmountByRegion = whatsBuyDAO.getNonCompetitiveAmountByRegion();

        competitiveAmountByRegion.forEach(competitive -> {
            Optional<StringLong> nonCompetitive = nonCompetitiveAmountByRegion.stream()
                    .filter(value -> value.getName().equals(competitive.getName()))
                    .findAny();

            if (nonCompetitive.isPresent()) {
                long fullAmount = competitive.getValue() + nonCompetitive.get().getValue();
                competitive.setValue(competitive.getValue() * 100 / fullAmount);
                nonCompetitive.get().setValue(100 - competitive.getValue());
            } else {
                competitive.setValue(100L);
            }
        });

        response.setCompetitiveAmountByRegion(competitiveAmountByRegion);
        response.setNonCompetitiveAmountByRegion(nonCompetitiveAmountByRegion);
        return response;
    }

    @Cacheable("plans")
    public PlansResponse getPlans(Integer year) {
        PlansResponse response = new PlansResponse();

        List<StringLong> countryTop10CpvPlans = indicatorsDAO.getTop10CpvPlans(year);
        List<StringLong> countryTop10PlannedCpv = indicatorsDAO.getTop10PlannedCpv(year);
        countryTop10CpvPlans.forEach(planCpv -> {

            PlansResponse.Cpv cpv = new PlansResponse.Cpv();
            cpv.setName(planCpv.getName());
            cpv.setPlanAmount(planCpv.getValue());

            countryTop10PlannedCpv.stream()
                    .filter(value -> planCpv.getName().equalsIgnoreCase(value.getName()))
                    .findAny().ifPresent(plannedCpv -> {
                cpv.setLotsAmount(plannedCpv.getValue());
            });

            response.getCountryTop10Planned().add(cpv);
        });

        List<Cpv> top10CpvPlans = indicatorsDAO.getTop10CpvPlansByRegion(year);
        List<Cpv> top10PlannedCpv = indicatorsDAO.getTop10PlannedCpvByRegion(year);

        Map<String, List<Cpv>> groupedPlannedByRegion = top10PlannedCpv.stream().collect(groupingBy(Cpv::getRegion));

        Map<String, List<Cpv>> groupedPlansByRegion = top10CpvPlans.stream().collect(groupingBy(Cpv::getRegion));
        groupedPlansByRegion.keySet().forEach(regionName -> {
            List<Cpv> topCpv = groupedPlansByRegion.get(regionName).stream()
                    .sorted(Comparator.comparing(Cpv::getAmount).reversed())
                    .limit(10).collect(toList());

            List<PlansResponse.Cpv> cpvs = topCpv.stream().map(daoCpv -> {

                PlansResponse.Cpv cpv = new PlansResponse.Cpv();
                cpv.setName(daoCpv.getName());
                cpv.setPlanAmount(daoCpv.getAmount());

                groupedPlannedByRegion.get(regionName).stream().filter(value ->
                        value.getName().equalsIgnoreCase(daoCpv.getName())
                ).findAny().ifPresent(planned -> {
                    cpv.setLotsAmount(planned.getAmount());
                });

                return cpv;
            }).collect(toList());

            PlansResponse.Region region = new PlansResponse.Region();
            region.setName(regionName);
            region.setCpvs(cpvs);
            response.getTop10PlannedByRegion().add(region);
        });

        List<StringLong> plannedLotsAmountByRegion = indicatorsDAO.getPlannedLotsAmountByRegion(year);
        List<StringLong> plansAmountByRegion = indicatorsDAO.getPlansAmountByRegion(year);

        long plannedLotsAmount = plannedLotsAmountByRegion.stream().mapToLong(StringLong::getValue).sum();
        long plansAmount = plansAmountByRegion.stream().mapToLong(StringLong::getValue).sum();

        long lotsAmountFromPlannedAmount = plannedLotsAmount * 100 / plansAmount;


        response.setLotsAmountFromPlannedAmount(lotsAmountFromPlannedAmount);

        List<PlansResponse.Region> lotsAmountFromPlannedAmountByRegion = new ArrayList<>();
        plansAmountByRegion.forEach(planRegion -> {
            Optional<StringLong> tenderingRegion = plannedLotsAmountByRegion.stream()
                    .filter(region -> planRegion.getName().equalsIgnoreCase(region.getName()))
                    .findAny();

            PlansResponse.Region region = new PlansResponse.Region();
            region.setName(planRegion.getName());
            region.setPlansAmount(planRegion.getValue());

            if (tenderingRegion.isPresent()) {
                region.setLotsAmount(tenderingRegion.get().getValue());
                region.setPercent(tenderingRegion.get().getValue() * 100 / region.getPlansAmount());
            } else {
                region.setPercent(100);
            }

            lotsAmountFromPlannedAmountByRegion.add(region);
        });
        response.setLotsAmountFromPlannedAmountByRegion(lotsAmountFromPlannedAmountByRegion);
        return response;
    }
}
