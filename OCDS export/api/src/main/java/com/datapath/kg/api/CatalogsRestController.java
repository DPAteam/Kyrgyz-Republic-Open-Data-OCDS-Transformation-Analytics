package com.datapath.kg.api;

import com.datapath.kg.common.containers.CurrencyRatesRequest;
import com.datapath.kg.common.containers.LegalFormsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/catalogs")
public class CatalogsRestController {

    @Autowired
    private CatalogsService service;

    @PostMapping("currency-rates")
    public Integer updateCurrencyRates(@RequestBody CurrencyRatesRequest request) {
        service.updateCurrencyRates(request);
        return request.getRates().size();
    }

    @GetMapping("currency-rates")
    public CurrencyRatesResponse getCurrencyRates() {
        return service.getCurrencyRates();
    }

    @PostMapping("legal-forms")
    public Integer updateLegalForms(@RequestBody LegalFormsRequest request) {
        service.updateLegalForms(request);
        return request.getLegalForms().size();
    }

    @GetMapping("legal-forms")
    public LegalFormsResponse getLegalForms() {
        return service.getLegalForms();
    }

}

