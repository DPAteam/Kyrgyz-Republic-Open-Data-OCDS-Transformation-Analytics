package com.datapath.kg.loader;

import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import com.datapath.kg.loader.dao.service.ReleaseDAOService;
import com.datapath.kg.loader.dto.ReleaseDTO;
import com.datapath.kg.loader.dto.ReleasesPage;
import com.datapath.kg.loader.handlers.ReleaseHandler;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Component
@Slf4j
@AllArgsConstructor
public class ReleaseLoader {

    private static final OffsetDateTime PROCESSED_TENDER_DATE_TIME = OffsetDateTime.parse("2018-01-01T00:00:00.000Z");

    private ReleaseDAOService releaseDAOService;
    private RestManager restManager;
    private ReleaseHandler releaseHandler;

    public void run() {
        ReleasesPage releasesPage;

        OffsetDateTime date = getLastOffset();

        do {
            log.info("Download releases since {}", date);
            releasesPage = restManager.getReleases(date);

            for (ReleaseDTO releaseDTO : releasesPage.getReleases()) {
                if (isProcessed(releaseDTO)) {
                    releaseHandler.handle(releaseDTO);
                }
            }

            if (nonNull(releasesPage.getPublishedDate())) {
                date = releasesPage.getPublishedDate();
            } else {
                break;
            }

        } while (true);
        log.info("All releases downloaded");
    }

    private OffsetDateTime getLastOffset() {
        ReleaseEntity release = releaseDAOService.getLastRelease();
        if (nonNull(release)) {
            return release.getDate();
        }
        return null;
    }

    private boolean isProcessed(ReleaseDTO releaseDTO) {
        if (isNull(releaseDTO.getTender().getDatePublished())) return true;
        return releaseDTO.getTender().getDatePublished().isAfter(PROCESSED_TENDER_DATE_TIME);
    }
}
