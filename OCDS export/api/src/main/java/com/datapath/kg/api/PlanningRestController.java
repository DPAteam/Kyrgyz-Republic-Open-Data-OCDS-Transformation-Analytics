package com.datapath.kg.api;

import com.datapath.kg.common.containers.IdResponse;
import com.datapath.kg.common.containers.PlanningRelease;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/planning")
public class PlanningRestController {

    private static final String DEFAULT_SIZE = "50";
    private static final String DEFAULT_PAGE = "0";
    private static final String DEFAULT_OFFSET = "2000-01-01";
    @Autowired
    private PlanningWebService service;

    @PostMapping
    public IdResponse addRelease(@RequestBody PlanningRelease release) {
        return service.addRelease(release);
    }

    @GetMapping("{id}")
    public PlanningRelease getRelease(@PathVariable String id) {
        return service.getRelease(id);
    }

    @GetMapping
    public Page<PlanningRelease> getReleases(@RequestParam(defaultValue = DEFAULT_OFFSET) String offset,
                                      @RequestParam(defaultValue = DEFAULT_PAGE) Integer page,
                                      @RequestParam(defaultValue = DEFAULT_SIZE) Integer size) {
        return service.getReleases(offset, page, size);
    }

}