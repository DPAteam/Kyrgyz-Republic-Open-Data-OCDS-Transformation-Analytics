package com.datapath.kg.api;

import com.datapath.kg.api.dao.TenderingDAOService;
import com.datapath.kg.common.containers.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static java.util.Collections.singletonList;

@Component
@Slf4j
public class TenderingWebService {

    private static final Publisher PUBLISHER = new Publisher("Ministry of Finance, Public Procurement Department");
    private static final String VERSION = "1.1";
    private static final String OFFSET = "offset";
    private final List<String> extensions;
    @Autowired
    private TenderingDAOService dao;
    @Autowired
    private ReleasePreparer preparer;

    public TenderingWebService() {
        extensions = new ArrayList<>();
        extensions.add("https://raw.githubusercontent.com/open-contracting-extensions/ocds_lots_extension/v1.1.4/extension.json");
        extensions.add("https://raw.githubusercontent.com/open-contracting-extensions/ocds_enquiry_extension/master/extension.json");
        extensions.add("https://raw.githubusercontent.com/open-contracting-extensions/ocds_bid_extension/master/extension.json");
    }

    //TODO test with raw requests
    public IdResponse addRelease(TenderingRelease release) {
        log.info("Add new release with ocid - {}", release.getOcid());
        Optional<TenderingRelease> dbRelease = dao.findByOcid(release.getOcid());
        if (dbRelease.isPresent()) {
            TenderingRelease prepared = preparer.prepare(release);
            if (!prepared.equals(dbRelease.get())) {
                dao.delete(dbRelease.get());
                dao.save(prepared);
            }
        } else {
            dao.save(release);
        }
        return new IdResponse(release.getId());
    }

    public ReleasePackage getRelease(String ocid) {
        TenderingRelease release = dao.getRelease(ocid);
        return pack(singletonList(release));
    }

    private ReleasePackage pack(List<TenderingRelease> releases) {
        Optional<TenderingRelease> maxReleaseDate = releases.stream()
                .max(Comparator.comparing(TenderingRelease::getDate));

        ReleasePackage releasePackage = new ReleasePackage();
        releasePackage.setReleases(releases);
        releasePackage.setVersion(VERSION);
        maxReleaseDate.ifPresent(tenderingRelease -> releasePackage.setPublishedDate(tenderingRelease.getDate()));
        releasePackage.setPublisher(PUBLISHER);
        releasePackage.setUri(getCurrentURL());
        releasePackage.setExtensions(extensions);

        return releasePackage;
    }

    private String getCurrentURL() {
        return ServletUriComponentsBuilder.fromCurrentRequest().toUriString();
    }

    public ReleasePackage getReleases(OffsetDateTime since, Integer offset, Integer size) {
        Page<TenderingRelease> page = dao.find(since, offset, size);

        ReleasePackage releasePackage = pack(page.getContent());
        releasePackage.setLinks(getLinks(page));

        return releasePackage;
    }

    private Links getLinks(Page<TenderingRelease> page) {

        Links links = new Links();
        ServletUriComponentsBuilder uriBuilder = ServletUriComponentsBuilder.fromCurrentRequest();
        if (page.hasNext()) {
            String next = uriBuilder.replaceQueryParam(OFFSET, page.nextPageable().getPageNumber()).toUriString();
            links.setNext(next);
        }

        if (page.hasPrevious()) {
            String prev = uriBuilder.replaceQueryParam(OFFSET, page.previousPageable().getPageNumber()).toUriString();
            links.setPrev(prev);
        }

        return links;
    }

}
