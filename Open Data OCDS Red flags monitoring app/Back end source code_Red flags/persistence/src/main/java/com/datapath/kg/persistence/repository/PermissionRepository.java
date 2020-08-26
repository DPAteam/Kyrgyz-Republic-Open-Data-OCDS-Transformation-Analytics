package com.datapath.kg.persistence.repository;

import com.datapath.kg.persistence.entity.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<PermissionEntity, Integer> {

    PermissionEntity findByName(String name);
}
