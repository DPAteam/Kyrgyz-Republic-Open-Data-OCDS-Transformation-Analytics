package com.datapath.kg.exporter.tendering;

import com.datapath.kg.common.containers.TenderingRelease;
import com.datapath.kg.exporter.ApiManager;
import com.datapath.kg.exporter.tendering.dao.entity.ReleaseDAO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@AllArgsConstructor
public class TenderingHandler {

    private TenderingProvider provider;
    private TenderingConverter converter;
    private ApiManager apiManager;

    @Scheduled(fixedDelayString = "${tendering.delay}")
    public void handle() {
        List<Integer> tenderIds = provider.getTenders();
        tenderIds.forEach(tenderId -> {

            log.info("Handle tender with id {}", tenderId);
            try {
                ReleaseDAO releaseDAO = provider.assembleRelease(tenderId);
                TenderingRelease release = converter.toRelease(releaseDAO);
                apiManager.saveRelease(release);
            } catch (Exception ex) {
                log.error(ex.getMessage(), ex);
            }
        });
    }

    @Scheduled(fixedDelayString = "${tendering.daily.delay}")
    public void handleDailyTenders() {
        List<Integer> tenderIds = provider.getDailyTenders();
        tenderIds.forEach(tenderId -> {

            log.info("Handle tender with id {}", tenderId);
            try {
                ReleaseDAO releaseDAO = provider.assembleRelease(tenderId);
                TenderingRelease release = converter.toRelease(releaseDAO);
                apiManager.saveRelease(release);
            } catch (Exception ex) {
                log.error(ex.getMessage(), ex);
            }
        });
    }
}
