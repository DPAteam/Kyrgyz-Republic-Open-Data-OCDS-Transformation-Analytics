package com.datapath.kg.exporter;

import com.datapath.kg.common.containers.*;
import com.datapath.kg.common.validation.ValidationReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ApiManager {

    @Value("${api.url}")
    private String apiUrl;
    @Value("${api.planning.endpoint}")
    private String planningEndpoint;
    @Value("${api.tendering.endpoint}")
    private String tenderingEndpoint;
    @Value("${api.validation.endpoint}")
    private String validationEndpoint;
    @Value("${api.currencyRates.endpoint}")
    private String currencyRatesEndpoint;
    @Value("${api.legalForms.endpoint}")
    private String legalFormsEndpoint;


    @Autowired
    private RestTemplate restTemplate;

    public IdResponse saveRelease(PlanningRelease release) {
        return restTemplate.postForObject(apiUrl + planningEndpoint, release, IdResponse.class);
    }

    public IdResponse saveRelease(TenderingRelease release) {
        return restTemplate.postForObject(apiUrl + tenderingEndpoint, release, IdResponse.class);
    }

    public void saveValidationReport(ValidationReport report) {
        restTemplate.postForObject(apiUrl + validationEndpoint, report, Void.class);
    }

    public Integer saveCurrencyRates(CurrencyRatesRequest request) {
        return restTemplate.postForObject(apiUrl + currencyRatesEndpoint, request, Integer.class);
    }

    public Integer saveLegalForms(LegalFormsRequest request) {
        return restTemplate.postForObject(apiUrl + legalFormsEndpoint, request, Integer.class);
    }

}
