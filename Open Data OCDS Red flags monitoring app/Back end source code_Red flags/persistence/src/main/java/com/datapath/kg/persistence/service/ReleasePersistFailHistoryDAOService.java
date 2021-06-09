package com.datapath.kg.persistence.service;

import com.datapath.kg.persistence.entity.ReleasePersistFailHistoryEntity;
import com.datapath.kg.persistence.repository.ReleasePersistFailHistoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ReleasePersistFailHistoryDAOService {

    private final ReleasePersistFailHistoryRepository repository;

    public void save(ReleasePersistFailHistoryEntity entity) {
        repository.save(entity);
    }

    public void delete(String ocid) {
        repository.deleteByOcid(ocid);
    }

    public Page<ReleasePersistFailHistoryEntity> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
