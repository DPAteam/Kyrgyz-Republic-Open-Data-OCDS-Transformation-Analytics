package com.datapath.kg.loader.dao.repository;

import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.OffsetDateTime;

public interface ReleaseRepository extends JpaRepository<ReleaseEntity, String> {

    ReleaseEntity findFirstByDateNotNullOrderByDateDesc();

    ReleaseEntity findByOcid(String ocid);

    @Modifying
    @Query(nativeQuery = true, value = "update release set date = ?2 where ocid = ?1")
    void updateDate(String ocid, OffsetDateTime date);
}
