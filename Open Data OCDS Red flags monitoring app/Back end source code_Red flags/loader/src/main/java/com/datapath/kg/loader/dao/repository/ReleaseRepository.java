package com.datapath.kg.loader.dao.repository;

import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReleaseRepository extends JpaRepository<ReleaseEntity, String> {

    ReleaseEntity findFirstByDateNotNullOrderByDateDesc();

    ReleaseEntity findByOcid(String ocid);
}
