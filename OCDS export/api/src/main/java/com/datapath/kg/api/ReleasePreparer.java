package com.datapath.kg.api;

import com.datapath.kg.api.dao.TenderingDAOService;
import com.datapath.kg.common.containers.Award;
import com.datapath.kg.common.containers.Document;
import com.datapath.kg.common.containers.Lot;
import com.datapath.kg.common.containers.TenderingRelease;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * Post handling OCDS releases on api side
 */

@Component
@AllArgsConstructor
public class ReleasePreparer {

    private static final String PENDING = "pending";
    private static final String UNSUCCESSFUL = "unsuccessful";
    private TenderingDAOService dao;

    //TODO write unit test
    public TenderingRelease prepare(TenderingRelease release) {
        refreshLotsAmount(release);
        refreshDocuments(release);
        refreshAwards(release);
        return release;
    }

    // https://dpa.atlassian.net/browse/KIFMPATPI-94
    private void refreshLotsAmount(TenderingRelease release) {
        dao.findByOcid(release.getOcid()).ifPresent(dbRelease -> {

            List<Lot> lots = release.getTender().getLots();
            List<Lot> dbLots = dbRelease.getTender().getLots();

            if (!isEmpty(lots) && !isEmpty(dbLots)) {
                lots.forEach(lot -> {
                    if (lot.getValue().getAmount().equals(BigDecimal.ZERO)) {
                        dbLots.stream()
                                .filter(dbLot -> dbLot.getId().equals(lot.getId()))
                                .findAny()
                                .ifPresent(dbLot -> {
                                    BigDecimal dbLotAmount = dbLot.getValue().getAmount();
                                    if (dbLotAmount.compareTo(BigDecimal.ZERO) > 0) {
                                        lot.getValue().setAmount(dbLotAmount);
                                    }
                                });
                    }
                });
            }
        });
    }

    // https://dpa.atlassian.net/browse/KIFMPATPI-40
    private void refreshDocuments(TenderingRelease release) {
        dao.findByOcid(release.getOcid()).ifPresent(dbRelease -> {
            List<Document> docs = release.getTender().getDocuments();
            List<Document> dbDocs = dbRelease.getTender().getDocuments();

            if (!isEmpty(docs) && !isEmpty(dbDocs)) {
                docs.forEach(doc -> {
                    dbDocs.forEach(dbDoc -> {
                        if (doc.equals(dbDoc)) {
                            doc.setDateModified(dbDoc.getDateModified());
                        }
                    });
                });
            }
        });
    }

    //https://dpa.atlassian.net/browse/KIFMPATPI-108
    //TODO write test of check it by web request
    private void refreshAwards(TenderingRelease release) {
        List<Award> releaseAwards = release.getAwards();
        if (!isEmpty(releaseAwards)) {
            releaseAwards.stream()
                .filter(award -> !isEmpty(award.getRelatedLots()))
                    .collect(Collectors.groupingBy(award -> award.getRelatedLots().get(0)))
                    .forEach((lot, awards) -> {
                        boolean hasActive = awards.stream().anyMatch(award -> award.getStatus().equalsIgnoreCase("active"));
                        if (hasActive) {
                            awards.forEach(award -> {
                                if (award.getStatus().equalsIgnoreCase(PENDING)) {
                                    award.setStatus(UNSUCCESSFUL);
                                }
                            });
                        }
                    });
        }
    }

}
