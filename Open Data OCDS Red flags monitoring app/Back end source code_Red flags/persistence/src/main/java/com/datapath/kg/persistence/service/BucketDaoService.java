package com.datapath.kg.persistence.service;

import com.datapath.kg.persistence.entity.BucketEntity;
import com.datapath.kg.persistence.entity.BucketId;
import com.datapath.kg.persistence.repository.BucketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class BucketDaoService {

    private final BucketRepository repository;

    public BucketDaoService(BucketRepository repository) {
        this.repository = repository;
    }

    public void deleteByIds(Set<BucketId> ids) {
        repository.deleteByIdIn(ids);
    }

    public List<BucketEntity> findByUserIdAndDates(Integer userId, LocalDate startDate, LocalDate endDate) {
        return repository.findByUserIdAndDates(userId, startDate, endDate);
    }

    public List<BucketEntity> findByUserId(Integer userId) {
        return repository.findByUserId(userId);
    }

    public void saveAll(List<BucketEntity> entities) {
        repository.saveAll(entities);
    }
}
