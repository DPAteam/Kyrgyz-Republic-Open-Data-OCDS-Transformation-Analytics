package com.datapath.kg.persistence.repository;

import com.datapath.kg.persistence.entity.BucketEntity;
import com.datapath.kg.persistence.entity.BucketId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface BucketRepository extends JpaRepository<BucketEntity, BucketId> {

    @Query(nativeQuery = true, value = "select * from bucket where user_id = ?1")
    List<BucketEntity> findByUserId(Integer userId);

    @Query(nativeQuery = true, value = "select * from bucket where user_id = :userId and " +
            "added_date between :startDate and :endDate")
    List<BucketEntity> findByUserIdAndDates(@Param("userId") Integer userId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    @Modifying
    @Query(nativeQuery = true, value = "delete from bucket where user_id = ?1")
    void deleteAllByUserId(Integer userId);

    void deleteByIdIn(Set<BucketId> ids);
}
