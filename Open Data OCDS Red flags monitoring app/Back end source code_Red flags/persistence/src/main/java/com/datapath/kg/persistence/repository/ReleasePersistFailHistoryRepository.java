package com.datapath.kg.persistence.repository;

import com.datapath.kg.persistence.entity.ReleasePersistFailHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReleasePersistFailHistoryRepository extends JpaRepository<ReleasePersistFailHistoryEntity, String> {

    void deleteByOcid(String ocid);
}
