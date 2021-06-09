package com.datapath.kg.elasticsearchintegration;

import com.datapath.kg.elasticsearchintegration.services.TenderObjectsProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
public class ElasticIntegrationScheduler {

    @Value("${init.upload.days}")
    private Integer initUploadDays;
    @Value("${update.upload.days}")
    private Integer updateUploadDays;

    private final TenderObjectsProvider provider;

    public ElasticIntegrationScheduler(TenderObjectsProvider provider) {
        this.provider = provider;
    }

    @Scheduled(cron = "${long.update.cron}")
    public void longUpdate() {
        log.info("Long period elastic integration started. Period {} day(s)", initUploadDays);
        LocalDate startDate = getUpdateStartDate(initUploadDays);
        provider.update(startDate);
        log.info("Long period elastic integration finished");
    }

    @Scheduled(fixedDelay = 1000 * 60 * 15, initialDelay = 1000 * 3)
    public void shortUpdate() {
        log.info("Short period elastic integration started. Period {} day(s)", updateUploadDays);
        LocalDate startDate = getUpdateStartDate(updateUploadDays);
        provider.update(startDate);
        log.info("Short period elastic integration finished");
    }

    private LocalDate getUpdateStartDate(Integer daysBefore) {
        return LocalDate.now().minusDays(daysBefore);
    }
}
