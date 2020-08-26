package com.datapath.kg.elasticsearchintegration.services;

import com.datapath.kg.elasticsearchintegration.constants.Aggregations;
import com.datapath.kg.elasticsearchintegration.constants.Constants;
import com.datapath.kg.elasticsearchintegration.constants.ProcedureProperty;
import com.datapath.kg.elasticsearchintegration.domain.FilterQuery;
import com.datapath.kg.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.kg.elasticsearchintegration.domain.charts.DynamicChartData;
import com.datapath.kg.elasticsearchintegration.domain.charts.KPICharts;
import com.datapath.kg.elasticsearchintegration.domain.charts.TopRegion;
import com.datapath.kg.persistence.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.BucketOrder;
import org.elasticsearch.search.aggregations.bucket.filter.ParsedFilter;
import org.elasticsearch.search.aggregations.bucket.histogram.DateHistogramInterval;
import org.elasticsearch.search.aggregations.bucket.histogram.Histogram;
import org.elasticsearch.search.aggregations.bucket.histogram.ParsedDateHistogram;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedLongTerms;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedStringTerms;
import org.elasticsearch.search.aggregations.metrics.ParsedSum;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

import static com.datapath.kg.elasticsearchintegration.constants.Aggregations.*;
import static com.datapath.kg.elasticsearchintegration.constants.ProcedureProperty.*;
import static com.datapath.kg.persistence.utils.DateUtils.formatToString;
import static java.time.temporal.TemporalAdjusters.nextOrSame;
import static java.time.temporal.TemporalAdjusters.previousOrSame;
import static java.util.stream.Collectors.toList;

@Slf4j
@Service
public class ChartsDataExtractor extends BaseDataExtractor {

    private final RestHighLevelClient client;

    private final ProcedureFilterService filterService;

    @Autowired
    public ChartsDataExtractor(@Qualifier("customRestClient") RestHighLevelClient client, ProcedureFilterService filterService) {
        this.client = client;
        this.filterService = filterService;
    }

    KPICharts proceduresCountMonthly() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.dateHistogram(Aggregations.DAYS.value())
                        .calendarInterval(DateHistogramInterval.MONTH)
                        .field(ProcedureProperty.DATE_PUBLISHED.value())
                        .order(BucketOrder.key(true))
                        .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value()))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_RISK_COUNT.value(), QueryBuilders.termQuery(ProcedureProperty.WITH_RISK.value(), true))
                                .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value()))
                        )
                );

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        Date yearAgo = find12MonthAgoDate();
        Date lastMonth = findLastWholeMonthDate();
        applyDateRange(DateUtils.formatToString(yearAgo, Constants.DATE_FORMAT), DateUtils.formatToString(lastMonth, Constants.DATE_FORMAT), boolQuery);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        try {
            applyDateRange(DateUtils.formatToString(format.parse("2018-10-01"), Constants.DATE_FORMAT), DateUtils.formatToString(lastMonth, Constants.DATE_FORMAT), boolQuery);
        } catch (ParseException e) {
            log.error(e.getMessage(), e);
        }
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        KPICharts kpiCharts = new KPICharts();

        ((ParsedDateHistogram) searchResponse.getAggregations()
                .get(Aggregations.DAYS.value())).getBuckets()
                .forEach(bucket -> {
                    kpiCharts.getDates().add(bucket.getKeyAsString());

                    long proceduresCount = bucket.getDocCount();
                    kpiCharts.getCheckedProceduresCount().add(proceduresCount);
                    double proceduresAmount = ((ParsedSum) bucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue();
                    kpiCharts.getCheckedProceduresAmount().add(proceduresAmount);

                    long riskedProceduresCount = ((ParsedFilter) bucket.getAggregations().get(Aggregations.WITH_RISK_COUNT.value())).getDocCount();
                    kpiCharts.getRiskedProceduresCount().add(riskedProceduresCount);
                    double riskedProceduresAmount = ((ParsedSum) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_RISK_COUNT.value())))
                            .getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue();
                    kpiCharts.getRiskedProceduresAmount().add(riskedProceduresAmount);

                    try {
                        kpiCharts.getPartsRiskedProceduresCount().add((double) riskedProceduresCount / proceduresCount * 100);
                    } catch (Exception e) {
                        log.error("Failed to calculate parts risked procedures", e);
                    }

                    try {
                        kpiCharts.getPartsRiskedProceduresAmount().add(riskedProceduresAmount / proceduresAmount * 100);
                    } catch (Exception e) {
                        log.error("Failed to calculate parts risked procedures", e);
                    }
                });
        return kpiCharts;
    }

    List<DynamicChartData> getDynamicOfGrowingProceduresAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.dateHistogram(Aggregations.DAYS.value())
                        .calendarInterval(DateHistogramInterval.WEEK)
                        .field(ProcedureProperty.DATE_PUBLISHED.value())
                        .order(BucketOrder.key(true))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_RISK_COUNT.value(), QueryBuilders.termQuery(ProcedureProperty.WITH_RISK.value(), true))
                                .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value())))
                        .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value()))
                );

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        Date firstMonday = findFirstMonday(filterQuery.getStartDate(), filterQuery.getEndDate());
        Date lastSunday = findLastSunday(filterQuery.getStartDate(), filterQuery.getEndDate());
        applyDateRange(DateUtils.formatToString(firstMonday, Constants.DATE_FORMAT), DateUtils.formatToString(lastSunday, Constants.DATE_FORMAT), boolQuery);

        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedDateHistogram) searchResponse.getAggregations()
                .get(Aggregations.DAYS.value())).getBuckets()
                .stream()
                .map(this::parseAggregationItemToDynamicChartDataAmount).collect(toList());
    }

    private DynamicChartData parseAggregationItemToDynamicChartDataAmount(Histogram.Bucket bucket) {
        Date date = Date.from(((ZonedDateTime) bucket.getKey()).toInstant());
        Double totalProcedures = ((ParsedSum) bucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue();
        Double countWithRisk = ((ParsedSum) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_RISK_COUNT.value()))).getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue();

        return DynamicChartData.builder()
                .date(date)
                .dateAsString(formatToString(date, Constants.DATE_FORMAT))
                .totalCount(totalProcedures)
                .countWithRisk(countWithRisk)
                .build();
    }

    List<DynamicChartData> getDynamicOfGrowingProceduresCount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.dateHistogram(Aggregations.DAYS.value())
                        .calendarInterval(DateHistogramInterval.WEEK)
                        .field(ProcedureProperty.DATE_PUBLISHED.value())
                        .order(BucketOrder.key(true))
                        .subAggregation(AggregationBuilders.filter(Aggregations.WITH_RISK_COUNT.value(), QueryBuilders.termQuery(ProcedureProperty.WITH_RISK.value(), true)))
                );
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);

        Date firstMonday = findFirstMonday(filterQuery.getStartDate(), filterQuery.getEndDate());
        Date lastSunday = findLastSunday(filterQuery.getStartDate(), filterQuery.getEndDate());
        applyDateRange(DateUtils.formatToString(firstMonday, Constants.DATE_FORMAT), DateUtils.formatToString(lastSunday, Constants.DATE_FORMAT), boolQuery);

        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedDateHistogram) searchResponse.getAggregations()
                .get(Aggregations.DAYS.value())).getBuckets()
                .stream()
                .map(this::parseAggregationItemToDynamicChartData).collect(toList());
    }

    private DynamicChartData parseAggregationItemToDynamicChartData(Histogram.Bucket bucket) {
        Date date = Date.from(((ZonedDateTime) bucket.getKey()).toInstant());
        Double totalProcedures = ((double) bucket.getDocCount());
        Double countWithRisk = ((double) ((ParsedFilter) bucket.getAggregations().get((Aggregations.WITH_RISK_COUNT.value()))).getDocCount());

        return DynamicChartData.builder()
                .date(date)
                .dateAsString(formatToString(date, Constants.DATE_FORMAT))
                .totalCount(totalProcedures)
                .countWithRisk(countWithRisk)
                .build();
    }

    List<KeyValueObject> getProceduresGroupByPurchaseMethod(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCEDURES.value()).field(TENDER_PROCUREMENT_METHOD_DETAIL_KEYWORD.value()).order(BucketOrder.key(false)));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.PROCEDURES.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(toList());
    }

    List<KeyValueObject> getProceduresGroupByPurchaseMethodAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.PROCEDURES.value()).field(TENDER_PROCUREMENT_METHOD_DETAIL_KEYWORD.value()).order(BucketOrder.key(false))
                        .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.PROCEDURES.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue()))
                .collect(toList());
    }

    List<KeyValueObject> getTop10ProcuringEntity(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.BUYER_NAME_AGG.value())
                        .field(ProcedureProperty.BUYER_NAME_KEYWORD.value())
                        .order(BucketOrder.count(false)).size(10));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.BUYER_NAME_AGG.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(toList());
    }

    List<KeyValueObject> getTop10ProcuringEntityAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.BUYER_NAME_AGG.value())
                        .field(ProcedureProperty.BUYER_NAME_KEYWORD.value()).order(BucketOrder.aggregation(AMOUNT_OF_RISK_AGG.value(), false))
                        .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.BUYER_NAME_AGG.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue()))
                .collect(toList());
    }

    List<KeyValueObject> getTop10Cpv(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.ITEM_CPV2_AGG.value())
                        .field(ProcedureProperty.ITEM_CPV2_KEYWORD.value())
                        .order(BucketOrder.count(false)).size(10));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.ITEM_CPV2_AGG.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(toList());
    }

    List<KeyValueObject> getTop10CpvAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.ITEM_CPV2_AGG.value())
                        .field(ProcedureProperty.ITEM_CPV2_KEYWORD.value()).order(BucketOrder.aggregation(AMOUNT_OF_RISK_AGG.value(), false))
                        .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedStringTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.ITEM_CPV2_AGG.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue()))
                .collect(toList());
    }

    List<KeyValueObject> getTop10RiskIndicators(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.RISK_INDICATORS.value()).field(INDICATORS_WITH_RISK.value()).size(10).order(BucketOrder.count(false)));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedLongTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.RISK_INDICATORS.value()))
                .getBuckets()
                .stream()
                .map(this::bucketToKeyValueObject)
                .collect(toList());
    }

    List<KeyValueObject> getTop10RiskIndicatorsAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.RISK_INDICATORS_AMOUNT.value()).field(INDICATORS_WITH_RISK.value())
                        .size(10)
                        .order(BucketOrder.aggregation(AMOUNT_OF_RISK_AGG.value(), false))
                        .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value())));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        return ((ParsedLongTerms) getSearchResponse(searchRequest, client).getAggregations()
                .get(Aggregations.RISK_INDICATORS_AMOUNT.value()))
                .getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), ((ParsedSum) bucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue()))
                .collect(toList());
    }

    List<TopRegion> getTop10RegionByProcedureCount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(Aggregations.BUYER_REGION_AGG.value())
                        .field(BUYER_REGION_KEYWORD.value())
                        .order(BucketOrder.count(false))
                        .size(10)
                        .subAggregation(
                                AggregationBuilders
                                        .filter(Aggregations.WITH_RISK_COUNT.value(),
                                                QueryBuilders.termQuery(ProcedureProperty.WITH_RISK.value(), true))
                        )
                );

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations()
                .get(Aggregations.BUYER_REGION_AGG.value()))
                .getBuckets()
                .stream()
                .map(bucket -> {
                    long risked = ((ParsedFilter) bucket.getAggregations().get(Aggregations.WITH_RISK_COUNT.value())).getDocCount();
                    return new TopRegion(bucket.getKeyAsString(), (double) bucket.getDocCount(), (double) risked);
                }).collect(toList());
    }

    List<TopRegion> getTop10RegionByProcedureAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(REGION_AMOUNT_AGG.value())
                        .field(BUYER_REGION_KEYWORD.value())
                        .size(10)
                        .order(BucketOrder.aggregation(AMOUNT_OF_RISK_AGG.value(), false))
                        .subAggregation(
                                AggregationBuilders
                                        .filter(Aggregations.WITH_RISK_COUNT.value(),
                                                QueryBuilders.termQuery(ProcedureProperty.WITH_RISK.value(), true))
                                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK_AGG.value()).field(ProcedureProperty.AMOUNT.value()))
                        )
                        .subAggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK_AGG.value()).field(ProcedureProperty.AMOUNT.value())));

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations().get(REGION_AMOUNT_AGG.value())).getBuckets()
                .stream()
                .map(bucket -> new TopRegion(
                        bucket.getKeyAsString(),
                        ((ParsedSum) bucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue(),
                        ((ParsedSum) ((ParsedFilter) bucket.getAggregations().get(Aggregations.WITH_RISK_COUNT.value())).getAggregations().asList().get(0)).getValue())
                ).collect(toList());
    }

    List<KeyValueObject> getProcedureByRiskTable(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(TENDER_PROCUREMENT_METHOD_DETAILS_AGG.value())
                        .field(TENDER_PROCUREMENT_METHOD_DETAIL_KEYWORD.value())
                        .size(10)
                        .subAggregation(
                                AggregationBuilders.terms(CODE_SUB_AGGREGATION.value())
                                        .field(INDICATORS_WITH_RISK.value())
                                        .size(50)
                                        .minDocCount(0)
                                        .order(BucketOrder.key(true))
                        )
                );

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations()
                .get(TENDER_PROCUREMENT_METHOD_DETAILS_AGG.value()))
                .getBuckets()
                .stream()
                .map(bucket -> {
                    String procedureType = bucket.getKeyAsString();
                    List<KeyValueObject> risks = ((ParsedLongTerms) bucket.getAggregations().get(CODE_SUB_AGGREGATION.value())).getBuckets()
                            .stream()
                            .map(subBucket -> {
                                Integer indicatorId = Integer.parseInt(subBucket.getKeyAsString());
                                return new KeyValueObject(indicatorId, subBucket.getDocCount());
                            }).collect(toList());

                    return new KeyValueObject(procedureType, risks);
                })
                .collect(toList());
    }

    List<KeyValueObject> getProcedureByRiskTableAmount(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.terms(TENDER_PROCUREMENT_METHOD_DETAILS_AGG.value())
                        .field(TENDER_PROCUREMENT_METHOD_DETAIL_KEYWORD.value())
                        .size(10)
                        .subAggregation(
                                AggregationBuilders.terms(CODE_SUB_AGGREGATION.value())
                                        .field(INDICATORS_WITH_RISK.value())
                                        .size(50)
                                        .minDocCount(0)
                                        .order(BucketOrder.key(true))
                                        .subAggregation(AggregationBuilders.sum(AMOUNT_OF_RISK_AGG.value()).field(AMOUNT.value()))
                        )
                );

        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedStringTerms) searchResponse.getAggregations()
                .get(TENDER_PROCUREMENT_METHOD_DETAILS_AGG.value()))
                .getBuckets()
                .stream()
                .map(bucket -> {
                    String procedureType = bucket.getKeyAsString();
                    List<KeyValueObject> risks = ((ParsedLongTerms) bucket.getAggregations().get(CODE_SUB_AGGREGATION.value())).getBuckets()
                            .stream()
                            .map(subBucket -> {
                                Integer indicatorId = Integer.parseInt(subBucket.getKeyAsString());
                                return new KeyValueObject(indicatorId, ((ParsedSum) subBucket.getAggregations().get(AMOUNT_OF_RISK_AGG.value())).getValue());
                            }).collect(toList());
                    return new KeyValueObject(procedureType, risks);
                })
                .collect(toList());
    }

    private static Date findLastSunday(Date dateStart, Date dateEnd) {
        ZoneId defaultZoneId = ZoneId.systemDefault();
        LocalDate resultDateTime = dateEnd.toInstant().atZone(defaultZoneId).toLocalDate().with(previousOrSame(DayOfWeek.SUNDAY));
        Date resultDate = Date.from(resultDateTime.atStartOfDay(ZoneId.systemDefault()).toInstant());
        if (resultDate.before(dateStart)) {
            return dateEnd;
        }
        return resultDate;
    }

    private static Date findFirstMonday(Date dateStart, Date dateEnd) {
        ZoneId defaultZoneId = ZoneId.systemDefault();
        LocalDate resultDateTime = dateStart.toInstant().atZone(defaultZoneId).toLocalDate().with(nextOrSame(DayOfWeek.MONDAY));
        Date resultDate = Date.from(resultDateTime.atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date lastSunday = findLastSunday(dateStart, dateEnd);
        if (resultDate.before(lastSunday)) {
            return resultDate;
        }
        return dateStart;
    }

    private static Date find12MonthAgoDate() {
        LocalDate currentMonthDate = LocalDate.now().withDayOfMonth(1);
        return Date.from(currentMonthDate.minusMonths(12).atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    private static Date findLastWholeMonthDate() {
        return Date.from(LocalDate.now().withDayOfMonth(1).minusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
