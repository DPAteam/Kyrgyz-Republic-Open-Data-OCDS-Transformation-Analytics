package com.datapath.kg.loader.dao.service;

import com.datapath.kg.loader.dao.entity.PartyEntity;
import com.datapath.kg.loader.dao.repository.PartyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PartyDAOService {

    private PartyRepository repository;

    public PartyEntity save(PartyEntity partyEntity) {
        repository.findByOuterId(partyEntity.getOuterId()).ifPresent(party -> partyEntity.setId(party.getId()));
        return repository.save(partyEntity);
    }
}