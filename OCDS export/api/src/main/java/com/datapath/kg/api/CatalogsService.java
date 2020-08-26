package com.datapath.kg.api;


import com.datapath.kg.common.containers.CurrencyRatesRequest;
import com.datapath.kg.common.containers.LegalFormsRequest;

public interface CatalogsService {

    void updateCurrencyRates(CurrencyRatesRequest request);

    CurrencyRatesResponse getCurrencyRates();

    void updateLegalForms(LegalFormsRequest request);

    LegalFormsResponse getLegalForms();

}
