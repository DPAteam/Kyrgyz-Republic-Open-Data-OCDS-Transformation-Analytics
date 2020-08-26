package com.datapath.kg.api;

import com.datapath.kg.common.containers.CurrencyRate;
import com.datapath.kg.common.containers.CurrencyRatesRequest;
import com.datapath.kg.common.containers.LegalForm;
import com.datapath.kg.common.containers.LegalFormsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Component
public class CatalogsServiceImpl implements CatalogsService {

    private static final String DATE = "date";
    private static final String CODE = "code";
    private static final String CURRENCY_RATES = "currencyRates";
    private static final String LEGAL_FORMS = "legalForms";

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void updateCurrencyRates(CurrencyRatesRequest request) {
        for (CurrencyRate rate : request.getRates()) {
            Query existQuery = new Query().addCriteria(
                    new Criteria().andOperator(
                            where(DATE).is(rate.getDate()),
                            where(CODE).is(rate.getCode())
                    ));
            boolean exists = mongoTemplate.exists(existQuery, CURRENCY_RATES);
            if (!exists) {
                mongoTemplate.save(rate, CURRENCY_RATES);
            }
        }
    }

    @Override
    public CurrencyRatesResponse getCurrencyRates() {
        return new CurrencyRatesResponse(mongoTemplate.findAll(CurrencyRate.class, CURRENCY_RATES));
    }

    @Override
    public void updateLegalForms(LegalFormsRequest request) {
        for (LegalForm form : request.getLegalForms()) {
            mongoTemplate.save(form, LEGAL_FORMS);
        }
    }

    @Override
    public LegalFormsResponse getLegalForms() {
        return new LegalFormsResponse(mongoTemplate.findAll(LegalForm.class, LEGAL_FORMS));
    }
}

