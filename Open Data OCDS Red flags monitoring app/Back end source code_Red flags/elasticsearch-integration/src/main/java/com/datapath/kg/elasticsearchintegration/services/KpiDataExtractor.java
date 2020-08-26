package com.datapath.kg.elasticsearchintegration.services;

import com.datapath.kg.elasticsearchintegration.constants.Aggregations;
import com.datapath.kg.elasticsearchintegration.constants.ProcedureProperty;
import com.datapath.kg.elasticsearchintegration.domain.FilterQuery;
import com.datapath.kg.elasticsearchintegration.domain.KpiInfo;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.metrics.ParsedCardinality;
import org.elasticsearch.search.aggregations.metrics.ParsedSum;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class KpiDataExtractor extends BaseDataExtractor {

    private final ProcedureFilterService filterService;

    private final RestHighLevelClient client;

    @Autowired
    public KpiDataExtractor(@Qualifier("customRestClient") RestHighLevelClient client, ProcedureFilterService filterService) {
        this.client = client;
        this.filterService = filterService;
    }

    KpiInfo getData() {
        KpiInfo kpiInfo = new KpiInfo();

        setTotalKpiInfo(kpiInfo);
        setRiskedKpiInfo(kpiInfo);

        kpiInfo.setCheckedRiskBuyersCount(countDistinctBuyerWithRisk());
        kpiInfo.setCheckedBuyersCount(countDistinctBuyer());
        kpiInfo.setIndicatorsCount(countDistinctIndicators());
        kpiInfo.setRiskIndicatorsCount(countDistinctIndicatorsWithRisk());
        return kpiInfo;
    }

    KpiInfo getDataFiltered(FilterQuery filterQuery) {
        KpiInfo kpiInfo = new KpiInfo();
        setRiskedKpiInfo(kpiInfo, filterQuery);
        setTotalKpiInfo(kpiInfo, filterQuery);
        kpiInfo.setCheckedRiskBuyersCount(countDistinctBuyerWithRisk(filterQuery));
        kpiInfo.setCheckedBuyersCount(countDistinctBuyer(filterQuery));
        kpiInfo.setIndicatorsCount(countDistinctIndicators(filterQuery));
        kpiInfo.setRiskIndicatorsCount(countDistinctIndicatorsWithRisk(filterQuery));
        return kpiInfo;
    }

    private long countDistinctBuyerWithRisk(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.BUYER_ID_AGG.value()).field(ProcedureProperty.BUYER_ID_KEYWORD.value()));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.BUYER_ID_AGG.value())).getValue();
    }

    private long countDistinctBuyerWithRisk() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.BUYER_ID_AGG.value()).field(ProcedureProperty.BUYER_ID_KEYWORD.value()));
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        applyRiskFilter(boolQuery);
        searchSourceBuilder.query(boolQuery);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.BUYER_ID_AGG.value())).getValue();
    }

    private long countDistinctBuyer() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.BUYER_ID_AGG.value()).field(ProcedureProperty.BUYER_ID_KEYWORD.value()));
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.BUYER_ID_AGG.value())).getValue();
    }

    private long countDistinctBuyer(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.BUYER_ID_AGG.value()).field(ProcedureProperty.BUYER_ID_KEYWORD.value()));
        searchSourceBuilder.query(filterService.getBoolQueryWithFilters(filterQuery));
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.BUYER_ID_AGG.value())).getValue();
    }

    private long countDistinctIndicators(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK_AGG.value()).field(ProcedureProperty.INDICATORS.value()));
        searchSourceBuilder.query(filterService.getBoolQueryWithFilters(filterQuery));
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK_AGG.value())).getValue();
    }

    private long countDistinctIndicators() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK_AGG.value()).field(ProcedureProperty.INDICATORS.value()));
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK_AGG.value())).getValue();
    }

    private long countDistinctIndicatorsWithRisk(FilterQuery filterQuery) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK_AGG.value()).field(ProcedureProperty.INDICATORS_WITH_RISK.value()));
        searchSourceBuilder.query(filterService.getBoolQueryWithFilters(filterQuery));
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK_AGG.value())).getValue();
    }

    private long countDistinctIndicatorsWithRisk() {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.cardinality(Aggregations.INDICATORS_WITH_RISK_AGG.value()).field(ProcedureProperty.INDICATORS_WITH_RISK.value()));
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return ((ParsedCardinality) searchResponse.getAggregations().get(Aggregations.INDICATORS_WITH_RISK_AGG.value())).getValue();
    }

    private SearchRequest getKPI(FilterQuery filterQuery, boolean withRisks) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK_AGG.value()).field(ProcedureProperty.AMOUNT.value()));
        BoolQueryBuilder boolQuery = filterService.getBoolQueryWithFilters(filterQuery);
        if (withRisks) {
            applyRiskFilter(boolQuery);
        }
        searchSourceBuilder.query(boolQuery);
        return searchRequest;
    }

    private SearchRequest getKPI(boolean withRisks) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source()
                .size(0)
                .aggregation(AggregationBuilders.sum(Aggregations.AMOUNT_OF_RISK_AGG.value()).field(ProcedureProperty.AMOUNT.value()));
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
        if (withRisks) {
            applyRiskFilter(boolQuery);
        }

        boolQuery.must(QueryBuilders.rangeQuery(ProcedureProperty.AMOUNT.value())
                .gte(0L)
                .lte(100_000_000_000L));

        searchSourceBuilder.query(boolQuery);
        return searchRequest;
    }

    private void setRiskedKpiInfo(KpiInfo kpiInfo) {
        SearchRequest searchRequest = getKPI(true);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setCheckedRiskProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setCheckedRiskProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK_AGG.value())).getValue());
    }

    private void setTotalKpiInfo(KpiInfo kpiInfo) {
        SearchRequest searchRequest = getKPI(false);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setCheckedProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setCheckedProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK_AGG.value())).getValue());
    }

    private void setTotalKpiInfo(KpiInfo kpiInfo, FilterQuery filterQuery) {
        SearchRequest searchRequest = getKPI(filterQuery, false);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setCheckedProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setCheckedProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK_AGG.value())).getValue());
    }

    private void setRiskedKpiInfo(KpiInfo kpiInfo, FilterQuery filterQuery) {
        SearchRequest searchRequest = getKPI(filterQuery, true);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        kpiInfo.setCheckedRiskProceduresCount(searchResponse.getHits().getTotalHits().value);
        kpiInfo.setCheckedRiskProceduresValue(((ParsedSum) searchResponse.getAggregations().get(Aggregations.AMOUNT_OF_RISK_AGG.value())).getValue());
    }


}
