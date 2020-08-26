package com.datapath.kg.persistence.repository;

import com.datapath.kg.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    UserEntity findByEmail(String email);

    UserEntity findOneById(Integer id);
}
