package com.datapath.kg.api.dao;

import com.datapath.kg.common.containers.PlanningRelease;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Set;

public interface PlanningRepository extends PagingAndSortingRepository<PlanningRelease, String> {

    @Query(fields = "{ 'id' : 1, 'date' : 1 }")
    Page<PlanningRelease> findByDateAfterOrderByDate(String offset, Pageable pageable);

    @Aggregation({
            "{$project : { _id : 0 ,'planning.plans.id' : 1 }}",
            "{$unwind: '$planning.plans'}",
            "{$group: { _id : '$planning.plans.id'}}"
    })
    Set<Integer> getPlanIds();

}
