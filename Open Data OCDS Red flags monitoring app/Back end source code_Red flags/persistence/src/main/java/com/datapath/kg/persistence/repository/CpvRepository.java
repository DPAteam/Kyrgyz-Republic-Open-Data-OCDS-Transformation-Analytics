package com.datapath.kg.persistence.repository;

import com.datapath.kg.persistence.entity.CpvEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CpvRepository extends JpaRepository<CpvEntity, String> {
}
