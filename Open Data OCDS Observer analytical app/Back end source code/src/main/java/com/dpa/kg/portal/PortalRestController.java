package com.dpa.kg.portal;

import com.dpa.kg.portal.response.*;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
@CrossOrigin
public class PortalRestController {

    private PortalWebService service;

    @GetMapping("indicators")
    public IndicatorsResponse getIndicators() {
        return service.getIndicators();
    }

    @GetMapping("exploration")
    public ExplorationResponse getExploration() {
        return service.getExploration();
    }

    @GetMapping("statistic")
    public StatisticResponse getStatistic(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                          @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.getStatistic(from, to);
    }

    @GetMapping(value = "export/json", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public String exportJson(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.exportJson(from, to);
    }


    @GetMapping(value = "export/csv", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public String exportCSV(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.exportCsv(from, to);
    }

    @GetMapping("international-participation")
    public InternationalParticipationResponse getInternationalParticipation() {
        return service.getInternationalParticipation();
    }

    @GetMapping("plans")
    public PlansResponse getPlans(@RequestParam Integer year) {
        return service.getPlans(year);
    }

    @GetMapping("whats-buy")
    public WhatsBuyResponse getWhatsBuy(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
                                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.getWhatsBuy(from,to);
    }

    @GetMapping("i18n")
    public I18nResponse getI18n() {
        return service.getI18n();
    }

}
