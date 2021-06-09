package com.datapath.kg.loader;

import com.datapath.kg.loader.dto.ReleasesPage;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.OffsetDateTime;

import static org.springframework.util.StringUtils.isEmpty;

@Component
public class RestManager {

    private final RestTemplate restTemplate;

    public RestManager(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ReleasesPage getReleases(OffsetDateTime date) {
        if (!isEmpty(date)) {
            return restTemplate.getForObject("/tendering?size=10&since={date}", ReleasesPage.class, date);
        } else {
            return restTemplate.getForObject("/tendering?size=10", ReleasesPage.class);
        }
    }

}
