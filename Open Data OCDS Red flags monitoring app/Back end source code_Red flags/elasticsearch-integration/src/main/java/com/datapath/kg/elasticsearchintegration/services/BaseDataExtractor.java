package com.datapath.kg.elasticsearchintegration.services;

import com.datapath.kg.elasticsearchintegration.constants.Constants;
import com.datapath.kg.elasticsearchintegration.constants.ProcedureProperty;
import com.datapath.kg.elasticsearchintegration.domain.KeyValueObject;
import com.datapath.kg.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public abstract class BaseDataExtractor {

    void applyDateRange(String startOfPeriod, String endOfPeriod, BoolQueryBuilder boolQuery) {
        boolQuery.must(QueryBuilders.rangeQuery(ProcedureProperty.DATE_PUBLISHED.value()).gte(startOfPeriod).lte(endOfPeriod));
    }

    void applyRiskFilter(BoolQueryBuilder boolQuery) {
        boolQuery.must(QueryBuilders.termsQuery(ProcedureProperty.WITH_RISK.value(), true));
    }

    SearchRequest getRequestBuilder() {
        SearchRequest searchRequest = new SearchRequest(Constants.ELASTICSEARCH_INDEX);
        SearchSourceBuilder source = new SearchSourceBuilder();
        source.trackTotalHits(true);
        searchRequest.source(source);
        return searchRequest;
    }

    SearchResponse getSearchResponse(SearchRequest searchRequest, RestHighLevelClient client) {
        try {
            return client.search(searchRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    KeyValueObject bucketToKeyValueObject(Terms.Bucket bucket) {
        return new KeyValueObject(bucket.getKeyAsString(), bucket.getDocCount());
    }

    List<TenderIndicatorsCommonInfo> responseToEntities(SearchResponse searchResponse) {
        List<TenderIndicatorsCommonInfo> results = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        for (SearchHit hit : searchResponse.getHits()) {
            TenderIndicatorsCommonInfo tenderIndicatorsCommonInfo = null;
            try {
                tenderIndicatorsCommonInfo = objectMapper.readValue(hit.getSourceAsString(), TenderIndicatorsCommonInfo.class);
            } catch (IOException e) {
                log.error("Could not map elastic response object to POJO", e);
            }
            results.add(tenderIndicatorsCommonInfo);
        }
        return results;
    }
}
