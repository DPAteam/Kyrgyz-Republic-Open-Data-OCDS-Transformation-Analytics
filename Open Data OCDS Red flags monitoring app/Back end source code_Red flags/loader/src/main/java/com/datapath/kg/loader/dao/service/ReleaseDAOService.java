package com.datapath.kg.loader.dao.service;

import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import com.datapath.kg.loader.dao.repository.ReleaseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@AllArgsConstructor
public class ReleaseDAOService {

    private ReleaseRepository releaseRepository;

    public ReleaseEntity getLastRelease() {
        return releaseRepository.findFirstByDateNotNullOrderByDateDesc();
    }

    public void save(ReleaseEntity entity) {
        releaseRepository.save(entity);
    }

    public ReleaseEntity findByOcid(String ocid) {
        return releaseRepository.findByOcid(ocid);
    }

    public void updateReleaseDate(String ocid, OffsetDateTime date) {
        releaseRepository.updateDate(ocid, date);
    }
}