package com.datapath.kg.loader.dao.service;

import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import com.datapath.kg.loader.dao.repository.ReleaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReleaseDAOService {

    @Autowired
    private ReleaseRepository releaseRepository;

    public ReleaseEntity getLastRelease() {
        return releaseRepository.findFirstByDateNotNullOrderByDateDesc();
    }

}