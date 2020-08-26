package com.dpa.kg.portal;

import lombok.AllArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Year;

import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

@Component
@AllArgsConstructor
public class CacheCleaner {

    private final CacheManager cacheManager;
    private final PortalWebService webService;

    @Scheduled(cron = "0 10 0 * * *")
    public void clear() {
        cacheManager.getCacheNames().forEach(name -> cacheManager.getCache(name).clear());
        cacheServiceResults();
    }

    private void cacheServiceResults() {
        LocalDate currentDate = LocalDate.now();
        webService.getIndicators();
        webService.getExploration();
        webService.getStatistic(currentDate.minusDays(365), currentDate);
        webService.getInternationalParticipation();
        webService.getPlans(Year.now().getValue());
        webService.getWhatsBuy(currentDate.minusDays(365), currentDate);

        for (int i = 2; i >= 0; i--) {
            LocalDate firstDayOfYear = LocalDate.now().minusYears(i).with(firstDayOfYear());
            LocalDate lastDayOfYear = LocalDate.now().minusYears(i).with(lastDayOfYear());
            webService.getStatistic(firstDayOfYear, lastDayOfYear);
            webService.getWhatsBuy(firstDayOfYear, lastDayOfYear);
        }

    }
}
