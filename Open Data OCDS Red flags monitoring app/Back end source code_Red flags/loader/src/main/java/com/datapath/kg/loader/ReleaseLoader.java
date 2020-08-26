package com.datapath.kg.loader;

import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import com.datapath.kg.loader.dao.service.ReleaseDAOService;
import com.datapath.kg.loader.dto.ReleaseDTO;
import com.datapath.kg.loader.dto.ReleasesPage;
import com.datapath.kg.loader.handlers.ReleaseHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import static java.util.Objects.nonNull;

@Component
@Slf4j
public class ReleaseLoader {

    private static final String FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern(FORMAT);

    private static final ZonedDateTime PROCESSED_TENDER_DATE_TIME = ZonedDateTime.parse("2018-01-01T00:00:00.000Z");

    @Autowired
    private ReleaseDAOService releaseDAOService;
    @Autowired
    private RestManager restManager;
    @Autowired
    private ReleaseHandler releaseHandler;

    public void run() {
        ReleasesPage releasesPage;

        String date = getLastOffset();

        do {
            log.info("Download releases since {}", date);
            releasesPage = restManager.getReleases(date);

            for (ReleaseDTO releaseDTO : releasesPage.getReleases()) {
                if (isProcessed(releaseDTO)) {
                    releaseHandler.handle(releaseDTO);
                }
            }

            if (nonNull(releasesPage.getPublishedDate())) {
                date = releasesPage.getPublishedDate().format(FORMATTER);
            } else {
                break;
            }

        } while (true);
    }

    private String getLastOffset() {
        ReleaseEntity release = releaseDAOService.getLastRelease();
        if (nonNull(release)) {
            return release.getDate().format(FORMATTER);
        }

        return null;
    }

    private boolean isProcessed(ReleaseDTO releaseDTO) {
        return ZonedDateTime.parse(releaseDTO.getTender().getDatePublished()).isAfter(PROCESSED_TENDER_DATE_TIME);
    }
}