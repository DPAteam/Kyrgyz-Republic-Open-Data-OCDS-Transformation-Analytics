package com.datapath.kg.api;

import com.datapath.kg.common.containers.Document;
import com.datapath.kg.common.containers.Tender;
import com.datapath.kg.common.containers.TenderingRelease;
import org.junit.Test;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Collections;

import static java.time.LocalTime.MIDNIGHT;
import static java.time.ZoneOffset.UTC;
import static org.junit.Assert.assertEquals;

public class ComparingReleaseTest {

    @Test
    public void testReleases() {
        TenderingRelease first = buildFirst();
        TenderingRelease second = buildSecond();

        assertEquals(first, second);
    }

    private TenderingRelease buildFirst() {
        TenderingRelease release = new TenderingRelease();
        release.setId("1");
        release.setDate(OffsetDateTime.of(LocalDate.parse("2019-01-01"), MIDNIGHT, UTC));

        Document doc = new Document();
        doc.setDateModified(OffsetDateTime.of(LocalDate.parse("2019-01-01"), MIDNIGHT, UTC));
        Tender tender = new Tender();
        tender.setDocuments(Collections.singletonList(doc));
        release.setTender(tender);

        return release;
    }

    private TenderingRelease buildSecond() {
        TenderingRelease release = new TenderingRelease();
        release.setId("1");
        release.setDate(OffsetDateTime.of(LocalDate.parse("2020-01-01"), MIDNIGHT, UTC));

        Document doc = new Document();
        doc.setDateModified(OffsetDateTime.of(LocalDate.parse("2020-01-01"), MIDNIGHT, UTC));
        Tender tender = new Tender();
        tender.setDocuments(Collections.singletonList(doc));
        release.setTender(tender);

        return release;
    }

}