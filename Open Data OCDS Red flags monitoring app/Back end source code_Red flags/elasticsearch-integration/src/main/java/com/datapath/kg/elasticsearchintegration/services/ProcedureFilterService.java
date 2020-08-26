package com.datapath.kg.elasticsearchintegration.services;

import com.datapath.kg.elasticsearchintegration.constants.Aggregations;
import com.datapath.kg.elasticsearchintegration.constants.Constants;
import com.datapath.kg.elasticsearchintegration.constants.ProcedureProperty;
import com.datapath.kg.elasticsearchintegration.domain.*;
import com.datapath.kg.persistence.utils.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.datapath.kg.elasticsearchintegration.constants.Aggregations.*;
import static com.datapath.kg.elasticsearchintegration.constants.Constants.ITEM_CPV2_SEARCH_FIELD;
import static com.datapath.kg.elasticsearchintegration.constants.Constants.ITEM_CPV_SEARCH_FIELD;
import static com.datapath.kg.elasticsearchintegration.constants.ProcedureProperty.*;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static java.util.stream.Collectors.toList;

@Service
@Slf4j
public class ProcedureFilterService extends BaseDataExtractor {

    private final RestHighLevelClient client;

    public ProcedureFilterService(@Qualifier("customRestClient") RestHighLevelClient client) {
        this.client = client;
    }

    public FilteringDTO filter(FilterQuery filterQuery) {
        SearchRequest searchRequest = getSearchRequestWithFilters(filterQuery);
        SearchSourceBuilder searchSourceBuilder = searchRequest.source();
        searchSourceBuilder.from(filterQuery.getPage() * filterQuery.getSize());
        searchSourceBuilder.size(filterQuery.getSize());
        addAggregationForAvailableFilters(searchSourceBuilder);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        List<TenderIndicatorsCommonInfo> results = responseToEntities(searchResponse);

        FilteringDTO filteringDTO = new FilteringDTO();
        filteringDTO.setAvailableFilters(getAvailableFilters(searchResponse));
        ProceduresWrapper proceduresWrapper = new ProceduresWrapper();
        proceduresWrapper.setProcedures(results);
        proceduresWrapper.setTotalCount(searchResponse.getHits().getTotalHits().value);
        filteringDTO.setData(proceduresWrapper);

        return filteringDTO;
    }

    public List<TenderIndicatorsCommonInfo> getByTenderIds(List<String> tenderIds) {
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source();
        searchSourceBuilder.query(filterByTenderIds(tenderIds));
        searchSourceBuilder.size(10000);
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return responseToEntities(searchResponse);
    }

    List<KeyValueObject> getFilterData(FilterQuery filterQuery) {
        BoolQueryBuilder boolQuery = getBoolQueryWithFilters(filterQuery);

        BoolQueryBuilder mainQuery = QueryBuilders.boolQuery();

        String searchField = extractSearchField(filterQuery);

        mainQuery.should(QueryBuilders.regexpQuery(searchField, ".*" + filterQuery.getSearchValue() + ".*"));

        if (BUYER_NAME_KEYWORD.value().equals(searchField)) {
            mainQuery.should(QueryBuilders.regexpQuery(BUYER_ID_KEYWORD.value(), ".*" + filterQuery.getSearchValue() + ".*"));
        }

        mainQuery.minimumShouldMatch(1);
        boolQuery.must(mainQuery);

        int searchCount = filterQuery.getSearchCount() > 0 ? filterQuery.getSearchCount() : 15;
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source();
        searchSourceBuilder.query(boolQuery);
        searchSourceBuilder.sort(ProcedureProperty.DATE_PUBLISHED.value(), SortOrder.DESC);

        String subAggField = BUYER_NAME_KEYWORD.value().equals(searchField) ?
                BUYER_ID_KEYWORD.value() :
                searchField;

        searchSourceBuilder.aggregation(
                AggregationBuilders.terms(TEMP.value())
                        .field(searchField)
                        .size(searchCount)
                        .subAggregation(AggregationBuilders.terms(CODE_SUB_AGGREGATION.value())
                                .field(subAggField)
                        )
        );

        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return parseNameAndCodeAggregationResultsToKeyValueList(searchResponse, Aggregations.TEMP.value());
    }

    List<String> checkAll(FilterQuery filterQuery) {
        BoolQueryBuilder boolQuery = getBoolQueryWithFilters(filterQuery);

        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source();
        searchSourceBuilder.query(boolQuery);
        searchSourceBuilder.fetchSource(new String[]{"tenderId"}, new String[]{});
        searchSourceBuilder.size(filterQuery.getSize());
        searchSourceBuilder.from(filterQuery.getPage() * filterQuery.getSize());
        SearchResponse searchResponse = getSearchResponse(searchRequest, client);
        return Arrays.stream(searchResponse.getHits().getHits()).map(item -> item.getSourceAsMap().get("tenderId").toString()).collect(toList());
    }

    private String extractSearchField(FilterQuery filterQuery) {
        if (ITEM_CPV_SEARCH_FIELD.equals(filterQuery.getSearchField())) {
            return ITEM_CPV_KEYWORD.value();
        } else if (ITEM_CPV2_SEARCH_FIELD.equals(filterQuery.getSearchField())) {
            return ITEM_CPV2_KEYWORD.value();
        }

        return BUYER_NAME_KEYWORD.value();
    }

    private SearchRequest getSearchRequestWithFilters(FilterQuery filterQuery) {
        BoolQueryBuilder mainQuery = getBoolQueryWithFilters(filterQuery);
        SearchRequest searchRequest = getRequestBuilder();
        SearchSourceBuilder searchSourceBuilder = searchRequest.source();
        searchSourceBuilder.query(mainQuery);

        addSortParameters(searchSourceBuilder, filterQuery);

        return searchRequest;
    }

    private void addSortParameters(SearchSourceBuilder searchSourceBuilder, FilterQuery filterQuery) {
        if (nonNull(filterQuery.getSortField())) {
            searchSourceBuilder.sort(fetchSortField(filterQuery.getSortField()), filterQuery.getSortDirection().equals("ASC") ? SortOrder.ASC : SortOrder.DESC);
        } else {
            searchSourceBuilder.sort("tenderDatePublished", SortOrder.DESC);
        }
        searchSourceBuilder.sort("tenderId.keyword", SortOrder.ASC);
    }

    private String fetchSortField(String sortField) {
        if (Constants.SORT_FIELDS_WITH_KEYWORD.contains(sortField)) {
            return sortField + ".keyword";
        } else if (Constants.SORT_FIELDS_WITHOUT_KEYWORD.contains(sortField)) {
            return sortField;
        }
        throw new RuntimeException("Unsupported sort field name: " + sortField);
    }

    BoolQueryBuilder getBoolQueryWithFilters(FilterQuery filterQuery) {
        BoolQueryBuilder mainQuery = QueryBuilders.boolQuery();
        addAllFilters(filterQuery, mainQuery);

        if (isNull(filterQuery.getProcedureId())) {
            applyDateRange(DateUtils.formatToString(filterQuery.getStartDate(), Constants.DATE_FORMAT), DateUtils.formatToString(filterQuery.getEndDate(), Constants.DATE_FORMAT), mainQuery);
        }

        return mainQuery;
    }

    private void addAllFilters(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (StringUtils.isNotEmpty(filterQuery.getProcedureId())) {
            filterByTenderId(filterQuery, mainQuery);
        } else {
            filterByRiskedIndicators(filterQuery, mainQuery);
            filterRiskedType(filterQuery, mainQuery);
            filterByBuyerRegion(filterQuery, mainQuery);
            filterByProcurementMethodDetails(filterQuery, mainQuery);
            filterByCpv2(filterQuery, mainQuery);
            filterByCpv(filterQuery, mainQuery);
            filterByBuyer(filterQuery, mainQuery);
            filterByStatusDetails(filterQuery, mainQuery);
            filterByAmount(filterQuery, mainQuery);
            filterByRiskLevels(filterQuery, mainQuery);
            filterByComplaints(filterQuery, mainQuery);
        }
    }

    private AvailableFilters getAvailableFilters(SearchResponse searchResponse) {
        AvailableFilters availableFilters = new AvailableFilters();
        availableFilters.setBuyerRegions(parseStringTermsAggregationResultsToKeyValueList(searchResponse, BUYER_REGION_AGG.value()));
        availableFilters.setStatusDetails(parseStringTermsAggregationResultsToKeyValueList(searchResponse, TENDER_STATUS_DETAIL_AGG.value()));
        availableFilters.setProcurementMethodDetails(parseStringTermsAggregationResultsToKeyValueList(searchResponse, TENDER_PROCUREMENT_METHOD_DETAILS_AGG.value()));
        availableFilters.setWithRisk(parseStringTermsAggregationResultsToKeyValueList(searchResponse, WITH_RISK_AGG.value()));
        availableFilters.setBuyers(parseNameAndCodeAggregationResultsToKeyValueList(searchResponse, BUYER_ID_AGG.value()));
        availableFilters.setRiskedIndicators(parseIntegerTermsAggregationResultsToKeyValueList(searchResponse, INDICATORS_WITH_RISK_AGG.value()));
        availableFilters.setItemCpv2(parseStringTermsAggregationResultsToKeyValueList(searchResponse, ITEM_CPV2_AGG.value()));
        availableFilters.setItemCpv(parseStringTermsAggregationResultsToKeyValueList(searchResponse, ITEM_CPV_AGG.value()));
        availableFilters.setRiskLevels(parseStringTermsAggregationResultsToKeyValueList(searchResponse, RISK_LEVEL_AGG.value()));
        availableFilters.setHasComplaints(parseStringTermsAggregationResultsToKeyValueList(searchResponse, HAS_COMPLAINTS_AGG.value()));
        return availableFilters;
    }

    private List<KeyValueObject> parseStringTermsAggregationResultsToKeyValueList(SearchResponse searchResponse, String aggregationName) {
        return ((Terms) searchResponse
                .getAggregations()
                .get(aggregationName)).getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(bucket.getKeyAsString(), bucket.getDocCount()))
                .collect(toList());
    }

    private List<KeyValueObject> parseIntegerTermsAggregationResultsToKeyValueList(SearchResponse searchResponse, String aggregationName) {
        return ((Terms) searchResponse
                .getAggregations()
                .get(aggregationName)).getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(Integer.parseInt(bucket.getKeyAsString()), bucket.getDocCount()))
                .collect(toList());
    }

    private List<KeyValueObject> parseNameAndCodeAggregationResultsToKeyValueList(SearchResponse searchResponse, String aggregationName) {
        return ((Terms) searchResponse
                .getAggregations()
                .get(aggregationName)).getBuckets()
                .stream()
                .map(bucket -> new KeyValueObject(
                        bucket.getKeyAsString(),
                        ((Terms) bucket.getAggregations().get(CODE_SUB_AGGREGATION.value()))
                                .getBuckets().get(0).getKeyAsString() + " - " + bucket.getKeyAsString()))
                .collect(toList());
    }

    private void addAggregationForAvailableFilters(SearchSourceBuilder searchSourceBuilder) {
        searchSourceBuilder.aggregation(AggregationBuilders.terms(BUYER_REGION_AGG.value())
                .field(BUYER_REGION_KEYWORD.value()).size(100));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(TENDER_STATUS_DETAIL_AGG.value())
                .field(TENDER_STATUS_DETAIL_KEYWORD.value()));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(TENDER_PROCUREMENT_METHOD_DETAILS_AGG.value())
                .field(TENDER_PROCUREMENT_METHOD_DETAIL_KEYWORD.value()));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(INDICATORS_WITH_RISK_AGG.value())
                .field(INDICATORS_WITH_RISK.value()).size(100));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(ITEM_CPV2_AGG.value())
                .field(ITEM_CPV2_KEYWORD.value()).size(10));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(ITEM_CPV_AGG.value())
                .field(ITEM_CPV_KEYWORD.value()).size(10));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(BUYER_ID_AGG.value())
                .field(BUYER_ID_KEYWORD.value()).size(10).subAggregation(
                        AggregationBuilders.terms(CODE_SUB_AGGREGATION.value())
                                .field(BUYER_NAME_KEYWORD.value())
                ));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(WITH_RISK_AGG.value())
                .field(WITH_RISK.value()).size(2));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(HAS_COMPLAINTS_AGG.value())
                .field(HAS_COMPLAINTS.value()).size(2));

        searchSourceBuilder.aggregation(AggregationBuilders.terms(RISK_LEVEL_AGG.value())
                .field(RISK_LEVEL.value()));
    }

    private void filterByTenderId(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        mainQuery.must(QueryBuilders.matchPhraseQuery(TENDER_ID_KEYWORD.value(), filterQuery.getProcedureId()));
    }

    private void filterByAmount(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        mainQuery.must(QueryBuilders.rangeQuery(AMOUNT.value())
                .gte(Optional.ofNullable(filterQuery.getMinExpectedValue()).orElse(0L))
                .lte(Optional.ofNullable(filterQuery.getMaxExpectedValue()).orElse(100_000_000_000L)));
    }

    private void filterByBuyerRegion(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getBuyerRegions())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (String region : filterQuery.getBuyerRegions()) {
                if (StringUtils.isNotEmpty(region)) {
                    boolQuery.should(QueryBuilders.termQuery(BUYER_REGION_KEYWORD.value(), region));
                }
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }

    }

    private BoolQueryBuilder filterByTenderIds(List<String> tenderIds) {
        if (!CollectionUtils.isEmpty(tenderIds)) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (String id : tenderIds) {
                if (StringUtils.isNotEmpty(id)) {
                    boolQuery.should(QueryBuilders.termQuery(TENDER_ID_KEYWORD.value(), id));
                }
            }
            boolQuery.minimumShouldMatch(1);
            return QueryBuilders.boolQuery().must(boolQuery);
        }
        return QueryBuilders.boolQuery();
    }

    private void filterByBuyer(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getBuyers())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (String namePE : filterQuery.getBuyers()) {
                if (StringUtils.isNotEmpty(namePE)) {
                    boolQuery.should(QueryBuilders.multiMatchQuery(namePE,
                            BUYER_NAME_KEYWORD.value(),
                            BUYER_ID_KEYWORD.value()));
                }
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }
    }

    private void filterByStatusDetails(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getStatusDetails())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (String status : filterQuery.getStatusDetails()) {
                if (StringUtils.isNotEmpty(status)) {
                    boolQuery.should(QueryBuilders.termQuery(TENDER_STATUS_DETAIL_KEYWORD.value(), status));
                }
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }
    }

    private void filterByCpv2(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getItemCpv2())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (String cpv2 : filterQuery.getItemCpv2()) {
                if (StringUtils.isNotEmpty(cpv2)) {
                    boolQuery.should(QueryBuilders.matchQuery(ITEM_CPV2_KEYWORD.value(), cpv2));
                }
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }
    }

    private void filterByCpv(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getItemCpv())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (String cpv : filterQuery.getItemCpv()) {
                if (StringUtils.isNotEmpty(cpv)) {
                    boolQuery.should(QueryBuilders.matchQuery(ITEM_CPV_KEYWORD.value(), cpv));
                }
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }
    }

    private void filterByProcurementMethodDetails(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getProcurementMethodDetails())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (String procurementMethod : filterQuery.getProcurementMethodDetails()) {
                if (StringUtils.isNotEmpty(procurementMethod)) {
                    boolQuery.should(QueryBuilders.matchQuery(ProcedureProperty.TENDER_PROCUREMENT_METHOD_DETAIL_KEYWORD.value(), procurementMethod));
                }
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }
    }

    private void filterRiskedType(FilterQuery filterQuery, BoolQueryBuilder boolQuery) {
        if (nonNull(filterQuery.getWithRisk())) {
            boolQuery.must(QueryBuilders.termQuery(WITH_RISK.value(), filterQuery.getWithRisk()));
        }
    }

    private void filterByComplaints(FilterQuery filterQuery, BoolQueryBuilder boolQuery) {
        if (nonNull(filterQuery.getHasComplaints())) {
            boolQuery.must(QueryBuilders.termQuery(HAS_COMPLAINTS.value(), filterQuery.getHasComplaints()));
        }
    }

    private void filterByRiskedIndicators(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getRiskedIndicators())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (Integer riskedIndicator : filterQuery.getRiskedIndicators()) {
                boolQuery.should(QueryBuilders.termQuery(INDICATORS_WITH_RISK.value(), riskedIndicator));
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }
    }

    private void filterByRiskLevels(FilterQuery filterQuery, BoolQueryBuilder mainQuery) {
        if (!CollectionUtils.isEmpty(filterQuery.getRiskLevels())) {
            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
            for (Integer level : filterQuery.getRiskLevels()) {
                boolQuery.should(QueryBuilders.termQuery(RISK_LEVEL.value(), level));
            }
            boolQuery.minimumShouldMatch(1);
            mainQuery.must(boolQuery);
        }
    }
}