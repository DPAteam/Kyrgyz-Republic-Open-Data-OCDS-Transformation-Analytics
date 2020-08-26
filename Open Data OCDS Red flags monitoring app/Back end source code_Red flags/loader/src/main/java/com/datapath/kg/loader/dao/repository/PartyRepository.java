package com.datapath.kg.loader.dao.repository;

import com.datapath.kg.loader.dao.entity.PartyEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PartyRepository extends CrudRepository<PartyEntity, Integer> {

    Optional<PartyEntity> findByOuterId(String outerId);

}
