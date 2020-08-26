package com.datapath.kg.exporter.catalogs;

import com.datapath.kg.common.containers.CurrencyRate;
import com.datapath.kg.common.containers.CurrencyRatesRequest;
import com.datapath.kg.common.containers.LegalForm;
import com.datapath.kg.common.containers.LegalFormsRequest;
import com.datapath.kg.exporter.ApiManager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@AllArgsConstructor
public class CatalogHandler {

    private final CurrencyRateReceiver rateReceiver;
    private final LegalFormsReceiver legalFormsReceiver;
    private final ApiManager apiManager;

    @Scheduled(cron = "${catalogs.cron}")
    public void run() {
        updateCurrencyRates();
        updateLegalForms();
    }

    private void updateCurrencyRates() {
        List<CurrencyRate> rates = rateReceiver.receive();
        Integer count = apiManager.saveCurrencyRates(new CurrencyRatesRequest(rates));
        log.info("Saved {} currency rates", count);
    }

    private void updateLegalForms() {
        List<LegalForm> rates = legalFormsReceiver.receive();
        Integer count = apiManager.saveLegalForms(new LegalFormsRequest(rates));
        log.info("Saved {} legal forms", count);
    }
}

