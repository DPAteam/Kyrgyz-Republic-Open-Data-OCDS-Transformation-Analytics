package com.datapath.kg.elasticsearchintegration.services;

import com.datapath.kg.elasticsearchintegration.constants.Constants;
import com.datapath.kg.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
public class ElasticsearchDataUploadService {

    private final RestHighLevelClient client;

    public ElasticsearchDataUploadService(@Qualifier("customRestClient") RestHighLevelClient client) {
        this.client = client;
    }

    void uploadItems(List<TenderIndicatorsCommonInfo> tenderIndicatorsCommonInfos) throws IOException {

        BulkRequest bulkRequest = new BulkRequest();
        tenderIndicatorsCommonInfos.forEach(item -> {
            try {
                byte[] json = new ObjectMapper().writeValueAsBytes(item);
                bulkRequest.add(new IndexRequest(Constants.ELASTICSEARCH_INDEX)
                        .id(item.getTenderId())
                        .source(json, XContentType.JSON));
            } catch (JsonProcessingException e) {
                log.error("Fail while preparing bulk request for upload to elastic", e);
            }
        });

        BulkResponse bulkItemResponses = client.bulk(bulkRequest, RequestOptions.DEFAULT);
        if (bulkItemResponses.hasFailures()) {
            log.info("Uploading has failures - {}", bulkItemResponses.hasFailures());
            log.error(bulkItemResponses.buildFailureMessage());
        }
    }
}
