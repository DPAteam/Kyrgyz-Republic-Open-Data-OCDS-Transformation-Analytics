package com.datapath.kg.site.controller;

import com.datapath.kg.site.request.BucketFilterRequest;
import com.datapath.kg.site.request.BucketRequest;
import com.datapath.kg.site.response.BucketResponse;
import com.datapath.kg.site.services.BucketWebService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("monitoring/bucket")
public class BucketController {

    private final BucketWebService service;

    public BucketController(BucketWebService service) {
        this.service = service;
    }

    @PostMapping("add")
    public void save(@Valid @RequestBody BucketRequest request) {
        service.save(request);
    }

    @PostMapping("all")
    public BucketResponse get(@Valid @RequestBody BucketFilterRequest request) {
        return service.get(request);
    }

    @DeleteMapping("remove")
    public void remove(@Valid @RequestBody BucketRequest request) {
        service.remove(request);
    }
}
