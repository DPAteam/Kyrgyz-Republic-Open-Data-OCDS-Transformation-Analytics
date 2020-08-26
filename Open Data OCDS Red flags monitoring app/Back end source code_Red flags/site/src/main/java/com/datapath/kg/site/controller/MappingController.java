package com.datapath.kg.site.controller;

import com.datapath.kg.site.dto.mapping.MappingDTO;
import com.datapath.kg.site.services.MappingWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("mappings")
public class MappingController {

    @Autowired
    private MappingWebService service;

    @GetMapping
    public MappingDTO get() {
        return service.get();
    }
}
