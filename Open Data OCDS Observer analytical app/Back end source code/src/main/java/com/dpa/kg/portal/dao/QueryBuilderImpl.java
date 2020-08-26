package com.dpa.kg.portal.dao;

import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators.Filter;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators.In;
import org.springframework.data.mongodb.core.aggregation.BooleanOperators.And;
import org.springframework.data.mongodb.core.aggregation.ComparisonOperators;
import org.springframework.data.mongodb.core.aggregation.ComparisonOperators.Eq;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators.Cond;
import org.springframework.data.mongodb.core.aggregation.StringOperators.SubstrCP;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import static org.springframework.data.mongodb.core.aggregation.ConditionalOperators.when;
import static org.springframework.data.mongodb.core.query.Criteria.where;

@Component
public class QueryBuilderImpl implements QueryBuilder {

    private static final String MONTH_FORMAT = "%Y-%m";
    private static final String DATE_FORMAT = "%Y-%m-%d";
    private static final String COMPLETE = "complete";
    public static final String DATE = "date";
    public static final String VALUE = "value";

    private AggregationOperation filterByTenderDatePublished(LocalDate from, LocalDate to) {
        return match(where("tender.datePublished").gte(from).lte(to));
    }

    @Override
    public Aggregation getActiveDays() {
        return newAggregation(
                project().and("tender.datePublished").dateAsFormattedString(DATE_FORMAT).as(DATE),
                group(DATE).count().as("tendersCount"),
                match(where("tendersCount").gt(0)),
                project().andExpression("_id").as(VALUE),
                sort(Direction.DESC, VALUE),
                limit(7)
        );
    }

    @Override
    public Aggregation getPublishedTendersCountByMonth(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                project().and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                group(DATE).count().as(VALUE).first(DATE).as(DATE),
                sort(Direction.ASC, DATE)
        );
    }

    @Override
    public Aggregation getCompletedLotsAmountByMonth(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                project("tender").and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                group(DATE).sum("tender.lots.value.amount").as(VALUE).first(DATE).as(DATE),
                sort(Direction.ASC, DATE)
        );
    }

    @Override
    public Aggregation getAvgSupplierCompletedLots(LocalDate from, LocalDate to) {
        return newAggregation(
                match(where("tender.datePublished").gte(from).lte(to).and("tender.procurementMethod").ne("direct")),
                unwind("parties"),
                match(where("parties.roles").in("supplier")),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                group("parties.id").count().as("lotsCount"),
                group().avg("lotsCount").as(VALUE)
        );
    }

    @Override
    public Aggregation getAvgSupplierCompletedLotsByMonth(LocalDate from, LocalDate to) {
        return newAggregation(
                match(where("tender.datePublished").gte(from).lte(to).and("tender.procurementMethod").ne("direct")),
                project("tender", "parties").and("tender.datePublished").dateAsFormattedString("%Y-%m").as(DATE),
                unwind("parties"),
                match(where("parties.roles").in("supplier")),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                group(DATE, "parties.id").count().as("lotsCount"),
                group(DATE).avg("lotsCount").as(VALUE).first(DATE).as(DATE)
        );
    }

    @Override
    public Aggregation getBuyerGeography(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                match(where("parties.address.region").exists(true).ne(null)),
                project("parties"),
                group("parties.address.region")
                        .first("parties.address.region").as("name")
                        .addToSet("parties.id").as("buyers"),
                project("name").and(ArrayOperators.Size.lengthOfArray("buyers")).as("value")
        );
    }

    @Override
    public Aggregation getSupplierGeography(LocalDate from, LocalDate to) {
        return newAggregation(
                match(where("tender.datePublished").gte(from).lte(to)),
                unwind("parties"),
                match(where("parties.roles").in("supplier")),
                project("parties"),
                group("parties.address.countryName")
                        .first("parties.address.countryName").as("name")
                        .count().as(VALUE)
        );
    }

    @Override
    public Aggregation getCompletedLotsPercentage(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("tender.lots"),
                project().and("isCompleted").applyCondition(
                        when(where("tender.lots.status").is("complete")).then(1).otherwise(0)),
                group().sum("isCompleted").as("completedCount").count().as("all")
        );
    }

    @Override
    public Aggregation getMostPopularCPVByLotsCount(LocalDate from, LocalDate to) {
        return
                newAggregation(
                        filterByTenderDatePublished(from, to),
                        unwind("parties"),
                        match(where("parties.roles").in("buyer")),
                        match(where("parties.address.region").exists(true).ne(null)),
                        unwind("tender.lots"),
                        match(where("tender.lots.status").is(COMPLETE)),
                        unwind("tender.items"),
                        project()
                                .and("parties.address.region").as("region")
                                .and(Eq.valueOf("tender.lots.id").equalTo("tender.items.relatedLot")).as("valid")
                                .and("cpv").applyCondition(
                                Cond.when(Eq.valueOf("tender.items.classification.scheme").equalToValue("OKGZ"))
                                        .then(SubstrCP.valueOf("$tender.items.classification.id").substringCP(0, 2))
                                        .otherwise("93000000-3")),
                        match(where("valid").is(true)),
                        group("region", "cpv").count().as("lotsCount"),
                        project("lotsCount").andExpression("_id.region").as("region")
                                .andExpression("_id.cpv").as("cpv"),
                        sort(Direction.DESC, "lotsCount"),
                        group("region")
                                .first("cpv").as("cpv")
                                .max("lotsCount").as("lotsCount"),
                        project("cpv", "lotsCount").and("_id").as("region")
                );
    }

    @Override
    public Aggregation getMostPopularCPVByLotsAmount(LocalDate from, LocalDate to) {
        return
                newAggregation(
                        filterByTenderDatePublished(from, to),
                        unwind("parties"),
                        match(where("parties.roles").in("buyer")),
                        match(where("parties.address.region").exists(true).ne(null)),
                        unwind("tender.lots"),
                        match(where("tender.lots.status").is(COMPLETE)),
                        unwind("tender.items"),
                        project()
                                .and("tender.lots.value.amount").as("amount")
                                .and("parties.address.region").as("region")
                                .and(Eq.valueOf("tender.lots.id").equalTo("tender.items.relatedLot")).as("valid")
                                .and("cpv").applyCondition(
                                Cond.when(Eq.valueOf("tender.items.classification.scheme").equalToValue("OKGZ"))
                                        .then(SubstrCP.valueOf("$tender.items.classification.id").substringCP(0, 2))
                                        .otherwise("93000000-3")),
                        match(where("valid").is(true)),
                        group("region", "cpv").sum("amount").as("lotsAmount"),
                        project("lotsAmount").andExpression("_id.region").as("region")
                                .andExpression("_id.cpv").as("cpv"),
                        sort(Direction.DESC, "lotsAmount"),
                        group("region")
                                .first("cpv").as("cpv")
                                .max("lotsAmount").as("lotsAmount"),
                        project("cpv", "lotsAmount").and("_id").as("region")
                );
    }

    @Override
    public Aggregation getSuppliersCountries() {
        return newAggregation(
                unwind("parties"),
                match(where("parties.roles").in("supplier")),
                group("parties.address.countryName")
                        .first("parties.address.countryName").as("name")
                        .count().as(VALUE)
        );
    }

    @Override
    public Aggregation getSuppliersRegions() {
        return newAggregation(
                project()
                        .and(Filter.filter("parties").as("party")
                                .by(In.arrayOf("party.roles").containsValue("buyer"))
                        ).as("buyer")
                        .and(
                                Filter.filter("parties").as("party")
                                        .by(And.and(
                                                In.arrayOf("party.roles").containsValue("supplier"),
                                                ComparisonOperators.Ne.valueOf("party.address.countryName").notEqualToValue("Кыргызская Республика")
                                        ))
                        ).as("supplier"),
                unwind("buyer"),
                unwind("supplier"),
                group("buyer.address.region").addToSet("supplier.id").as("suppliers"),
                project().andExpression("_id").as("name").and(ArrayOperators.Size.lengthOfArray("suppliers")).as("value")

        );
    }

    @Override
    public Aggregation getTop5Cpv(List<String> activeDays) {
        return
                newAggregation(
                        unwind("tender.lots"),
                        unwind("tender.items"),
                        project()
                                .and("tender.lots.value.amount").as("amount")
                                .and(Eq.valueOf("tender.lots.id").equalTo("tender.items.relatedLot")).as("valid")
                                .and("cpv").applyCondition(
                                Cond.when(Eq.valueOf("tender.items.classification.scheme").equalToValue("OKGZ"))
                                        .then(SubstrCP.valueOf("$tender.items.classification.id").substringCP(0, 2))
                                        .otherwise("93000000-3")),
                        match(where("valid").is(true)),
                        group("cpv").sum("amount").as(VALUE),
                        project(VALUE).andExpression("_id").as("name"),
                        sort(Direction.DESC, VALUE),
                        limit(5)
                );
    }

    @Override
    public Aggregation getTop5Cpv(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                unwind("tender.items"),
                project("tender.lots")
                        .and("tender.lots.value.amount").as("amount")
                        .and("cpv").applyCondition(
                        Cond.when(Eq.valueOf("tender.items.classification.scheme").equalToValue("OKGZ"))
                                .then(SubstrCP.valueOf("$tender.items.classification.id").substringCP(0, 2))
                                .otherwise("93000000-3")),
                group("cpv").sum("amount").as("lotsAmount").count().as("lotsCount"),
                project("lotsAmount", "lotsCount").andExpression("_id").as("name"),
                sort(Direction.DESC, "lotsAmount"),
                limit(5)
        );
    }

    @Override
    public Aggregation getDepartmentEnquiriesCountByMonth(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                match(where("tender.enquiries").exists(true)),
                unwind("tender.enquiries"),
                match(where("tender.enquiries.author.id").is("KG-INN-01707201410029")),
                project().and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                group(DATE).count().as(VALUE),
                project(VALUE).andExpression("_id").as(DATE),
                sort(Direction.DESC, DATE)
        );
    }

    @Override
    public Aggregation getCompanyEnquiriesCountByMonth(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                match(where("tender.enquiries").exists(true)),
                unwind("tender.enquiries"),
                match(where("tender.enquiries.author.id").ne("KG-INN-01707201410029")),
                project().and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                group(DATE).count().as(VALUE),
                project(VALUE).andExpression("_id").as(DATE),
                sort(Direction.DESC, DATE)
        );
    }

    @Override
    public Aggregation getTop5Buyers(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                match(where("tender.procurementMethod").ne("direct")),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                match(where("parties.address.region").exists(true).ne(null)),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                group("parties.id")
                        .sum("tender.lots.value.amount").as("lotsAmount")
                        .count().as("lotsCount")
                        .first("parties.address.region").as("region")
                        .first("parties.identifier.legalName").as("name"),
                sort(Direction.DESC, "lotsAmount"),
                limit(5)

        );
    }

    @Override
    public Aggregation getComplaintStatuses(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                match(where("complaints").exists(true)),
                unwind("complaints"),
                group("complaints.status").count().as(VALUE),
                project(VALUE).andExpression("_id").as("name")
        );
    }

    @Override
    public Aggregation getComplaintStatusesByMonth(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                project("complaints").and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                match(where("complaints").exists(true)),
                unwind("complaints"),
                group(DATE, "complaints.status").count().as("count"),
                project("count").andExpression("_id.date").as(DATE).andExpression("_id.status").as("status")
        );
    }

    @Override
    public Aggregation getProcurementMethodDistribution(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                project("tender").and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                unwind("tender.lots"),
                match(where("tender.lots.status").is("complete")),
                facet()
                        .and(
                                match(where("tender.procurementMethod").is("limited")),
                                group(DATE).sum("tender.lots.value.amount").as(VALUE),
                                project(VALUE).andExpression("_id").as(DATE)
                        ).as("limited")
                        .and(
                                match(where("tender.procurementMethod").is("open")),
                                group(DATE).sum("tender.lots.value.amount").as(VALUE),
                                project(VALUE).andExpression("_id").as(DATE)
                        ).as("open")
                        .and(
                                match(where("tender.procurementMethod").is("direct")),
                                group(DATE).sum("tender.lots.value.amount").as(VALUE),
                                project(VALUE).andExpression("_id").as(DATE)
                        ).as("direct")
                        .and(
                                match(where("tender.procurementMethod").is("selective")),
                                group(DATE).sum("tender.lots.value.amount").as(VALUE),
                                project(VALUE).andExpression("_id").as(DATE)
                        ).as("selective")
        );
    }

    @Override
    public Aggregation getWhatsBuy(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                match(where("parties.address.region").exists(true).ne(null)),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                facet()
                        .and(
                                match(where("tender.procurementMethod").ne("direct")),
                                group("parties.address.region")
                                        .sum("tender.lots.value.amount").as(VALUE),
                                project(VALUE).andExpression("_id").as("name")
                        ).as("competitiveAmountByRegion")
                        .and(
                                match(where("tender.procurementMethod").is("direct")),
                                group("parties.address.region")
                                        .sum("tender.lots.value.amount").as(VALUE),
                                project(VALUE).andExpression("_id").as("name")
                        ).as("nonCompetitiveAmountByRegion")
                        .and(
                                unwind("tender.items"),
                                project("parties", "tender")
                                        .and("parties.address.region").as("region")
                                        .and("cpv").applyCondition(
                                        Cond.when(Eq.valueOf("tender.items.classification.scheme").equalToValue("OKGZ"))
                                                .then(SubstrCP.valueOf("$tender.items.classification.id").substringCP(0, 2))
                                                .otherwise("93000000-3")),
                                group("region", "cpv").sum("tender.lots.value.amount").as("amount"),
                                project("amount").andExpression("_id.region").as("region").andExpression("_id.cpv").as("cpv")
                        ).as("top10Cpv")
        );
    }

    @Override
    public Aggregation getBuyersActivity(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                project("tender", "parties").and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                unwind("tender.lots"),
                group("date")
                        .addToSet("parties.id").as("buyers")
                        .count().as("lotsCount")
                        .sum("tender.lots.value.amount").as("lotsAmount")
                        .first("date").as("date")
                ,
                project("date", "lotsAmount", "lotsCount").andExpression("buyers").size().as("buyersCount")
        );
    }

    @Override
    public Aggregation getQualificationRequirementTypes(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("tender.qualificationRequirements"),
                group("tender.qualificationRequirements.type")
                        .first("tender.qualificationRequirements.type").as("name")
                        .count().as("value"),
                sort(Direction.DESC, "value")
        );
    }

    @Override
    public Aggregation getResidentSuppliersCount(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("parties"),
                match(where("parties.roles").in("supplier")),
                match(where("parties.address.countryName").is("Кыргызская Республика")),
                group().addToSet("parties.id").as("suppliers"),
                project().and(ArrayOperators.Size.lengthOfArray("suppliers")).as("value")
        );
    }

    @Override
    public Aggregation getNonResidentSuppliersCount(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("parties"),
                match(where("parties.roles").in("supplier")),
                match(where("parties.address.countryName").ne("Кыргызская Республика")),
                group().addToSet("parties.id").as("suppliers"),
                project().and(ArrayOperators.Size.lengthOfArray("suppliers")).as("value")
        );
    }

    @Override
    public Aggregation getCapitalBuyersCount(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                match(where("parties.address.region").is("Бишкек")),
                group().addToSet("parties.id").as("buyers"),
                project().and(ArrayOperators.Size.lengthOfArray("buyers")).as("value")
        );
    }

    @Override
    public Aggregation getNonCapitalBuyersCount(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                match(where("parties.address.region").ne("Бишкек")),
                group().addToSet("parties.id").as("buyers"),
                project().and(ArrayOperators.Size.lengthOfArray("buyers")).as("value")
        );
    }

    @Override
    public Aggregation getPlannedLotsAmountByRegion(Integer year) {
        return newAggregation(
                match(where("tender.datePublished").gte(Year.of(year).atMonth(1).atDay(1))),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                unwind("tender.lots"),
                match(where("tender.lots.relatedPlanID").exists(true)),
                group("parties.address.region")
                        .first("parties.address.region").as("name")
                        .sum("tender.lots.value.amount").as("value")


        );
    }

    @Override
    public Aggregation getPlansAmountByRegion(Integer year) {
        return newAggregation(
                match(where("planning.budgetYear").is(year)),
                unwind("planning.plans"),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                group("parties.address.region")
                        .first("parties.address.region").as("name")
                        .sum("planning.plans.value.amount").as("value")
        );
    }

    @Override
    public Aggregation getTop10CpvPlansByRegion(Integer year) {
        return newAggregation(
                match(where("planning.budgetYear").is(year)),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                unwind("planning.plans"),
                unwind("planning.plans.items"),

                project("planning", "parties")
                        .and("parties.address.region").as("region")
                        .and("cpv").applyCondition(
                        Cond.when(Eq.valueOf("planning.plans.items.classification.scheme").equalToValue("okgz"))
                                .then(SubstrCP.valueOf("planning.plans.items.classification.id").substringCP(0, 2))
                                .otherwise("93000000-3"))
                ,
                group("region", "cpv")
                        .first("parties.address.region").as("region")
                        .first("cpv").as("name")
                        .sum("planning.plans.value.amount").as("amount")
        );
    }

    @Override
    public Aggregation getTop10PlannedCpvByRegion(Integer year) {
        return newAggregation(
                match(where("tender.datePublished").gte(Year.of(year).atMonth(1).atDay(1))),
                unwind("parties"),
                match(where("parties.roles").in("buyer")),
                unwind("tender.lots"),
                match(where("tender.lots.relatedPlanID").exists(true)
                        .and("tender.lots.status").not().in("cancelled", "unsuccessful")
                ),
                unwind("tender.items"),
                project("tender", "parties")
                        .and("parties.address.region").as("region")
                        .and("cpv").applyCondition(
                        Cond.when(Eq.valueOf("tender.items.classification.scheme").equalToValue("OKGZ"))
                                .then(SubstrCP.valueOf("tender.items.classification.id").substringCP(0, 2))
                                .otherwise("93000000-3"))
                        .and(Eq.valueOf("tender.lots.id").equalTo("tender.items.relatedLot")).as("itemRelateToLot")
                ,
                match(where("itemRelateToLot").is(true)),
                group("region", "cpv")
                        .first("region").as("region")
                        .first("cpv").as("name")
                        .sum("tender.lots.value.amount").as("amount")
        );
    }

    @Override
    public Aggregation getTop10CpvPlans(Integer year) {
        return newAggregation(
                match(where("planning.budgetYear").is(year)),
                unwind("planning.plans"),
                unwind("planning.plans.items"),
                project("planning", "parties")
                        .and("cpv").applyCondition(
                        Cond.when(Eq.valueOf("planning.plans.items.classification.scheme").equalToValue("okgz"))
                                .then(SubstrCP.valueOf("planning.plans.items.classification.id").substringCP(0, 2))
                                .otherwise("93000000-3"))
                ,
                group("cpv")
                        .first("cpv").as("name")
                        .sum("planning.plans.value.amount").as("value"),
                sort(Direction.DESC, "value"),
                limit(10)
        );
    }

    @Override
    public Aggregation getTop10PlannedCpv(Integer year) {
        return newAggregation(
                match(where("tender.datePublished").gte(Year.of(year).atMonth(1).atDay(1))),
                unwind("tender.lots"),
                match(where("tender.lots.relatedPlanID").exists(true)
                        .and("tender.lots.status").not().in("cancelled", "unsuccessful")),
                unwind("tender.items"),
                project("tender")
                        .and("cpv").applyCondition(
                        Cond.when(Eq.valueOf("tender.items.classification.scheme").equalToValue("OKGZ"))
                                .then(SubstrCP.valueOf("tender.items.classification.id").substringCP(0, 2))
                                .otherwise("93000000-3"))
                        .and(Eq.valueOf("tender.lots.id").equalTo("tender.items.relatedLot")).as("itemRelateToLot")
                ,
                match(where("itemRelateToLot").is(true)),
                group("cpv")
                        .first("cpv").as("name")
                        .sum("tender.lots.value.amount").as("value")


        );
    }

    @Override
    public Aggregation getCompetition(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                unwind("tender.lots"),
                match(where("tender.lots.status").is("complete")),
                project("tender")
                        .and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE)
                        .and("notCompetitiveAmount").applyCondition(
                        Cond.when(Eq.valueOf("tender.procurementMethod").equalToValue("direct"))
                                .thenValueOf("tender.lots.value.amount")
                                .otherwise(0))
                        .and("competitiveAmount").applyCondition(
                        Cond.when(Eq.valueOf("tender.procurementMethod").equalToValue("direct"))
                                .then(0)
                                .otherwiseValueOf("tender.lots.value.amount")),
                group("date").sum("competitiveAmount").as("competitiveLotsAmount")
                        .sum("notCompetitiveAmount").as("notCompetitiveLotsAmount")
                .first(DATE).as(DATE),
                sort(Direction.ASC, DATE)
        );
    }

    @Override
    public Aggregation getEnquiriesCount(List<String> activeDays) {
        return newAggregation(
                unwind("tender.enquiries"),
                project("tender.enquiries").and("tender.enquiries.date").dateAsFormattedString("%Y-%m-%d").as(DATE),
                match(where(DATE).in(activeDays)),
                count().as(VALUE)
        );
    }

    @Override
    public Aggregation getEnquiriesCountByDate(List<String> activeDays) {
        return newAggregation(
                unwind("tender.enquiries"),
                project("tender.enquiries").and("tender.enquiries.date").dateAsFormattedString("%Y-%m-%d").as(DATE),
                match(where(DATE).in(activeDays)),
                group(DATE).count().as(VALUE),
                project(VALUE).and("_id").as(DATE)
        );
    }

    @Override
    public Aggregation getTop10NonResidentSupplierCountries() {
        return newAggregation(
                unwind("parties"),
                match(where("parties.roles").in("supplier")),
                match(where("parties.address.countryName").ne("Кыргызская Республика")),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                group("parties.address.countryName")
                        .sum("tender.lots.value.amount").as(VALUE),
                project(VALUE).andExpression("_id").as("name"),
                sort(Direction.DESC, VALUE),
                limit(10)
        );
    }

    @Override
    public Aggregation getProcurementMethodsAmountByDate(LocalDate from, LocalDate to) {
        return newAggregation(
                filterByTenderDatePublished(from, to),
                project("tender").and("tender.datePublished").dateAsFormattedString(MONTH_FORMAT).as(DATE),
                match(where("tender.datePublished").gte(from).lte(to)),
                unwind("tender.lots"),
                match(where("tender.lots.status").is(COMPLETE)),
                group("tender.procurementMethod", DATE).sum("tender.lots.value.amount").as("amount"),
                project("amount").andExpression("_id.procurementMethod").as("name").andExpression("_id.date").as(DATE)
        );
    }

}
