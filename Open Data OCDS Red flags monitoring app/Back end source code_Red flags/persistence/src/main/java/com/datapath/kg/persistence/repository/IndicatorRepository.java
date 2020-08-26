package com.datapath.kg.persistence.repository;

import com.datapath.kg.persistence.entity.IndicatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IndicatorRepository extends JpaRepository<IndicatorEntity, Integer> {
}
