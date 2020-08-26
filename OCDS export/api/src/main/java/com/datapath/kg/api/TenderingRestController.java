package com.datapath.kg.api;


import com.datapath.kg.common.containers.IdResponse;
import com.datapath.kg.common.containers.ReleasePackage;
import com.datapath.kg.common.containers.TenderingRelease;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("api/tendering")
@AllArgsConstructor
public class TenderingRestController {

    private static final String DEFAULT_SIZE = "5";
    private static final String DEFAULT_PAGE = "0";
    private static final String DEFAULT_OFFSET = "2000-01-01T00:00:00.00000+00:00";
    private final TenderingWebService service;

    @PostMapping
    public IdResponse addRelease(@RequestBody TenderingRelease release) {
        return service.addRelease(release);
    }

    @GetMapping("{ocid}")
    public ReleasePackage getRelease(@PathVariable String ocid) {
        return service.getRelease(ocid);
    }

    @GetMapping
    public ReleasePackage getReleases(@RequestParam(defaultValue = DEFAULT_OFFSET) String since,
                                      @RequestParam(defaultValue = DEFAULT_PAGE) Integer offset,
                                      @RequestParam(defaultValue = DEFAULT_SIZE) Integer size) {

        return service.getReleases(OffsetDateTime.parse(since), offset, size);
    }
}
