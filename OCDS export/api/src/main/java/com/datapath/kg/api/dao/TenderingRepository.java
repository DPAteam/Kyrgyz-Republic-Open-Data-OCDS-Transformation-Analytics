package com.datapath.kg.api.dao;

import com.datapath.kg.common.containers.TenderingRelease;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.time.OffsetDateTime;
import java.util.Optional;

public interface TenderingRepository extends PagingAndSortingRepository<TenderingRelease, String> {

    Page<TenderingRelease> findByDateAfterOrderByDate(OffsetDateTime offset, Pageable pageable);

    Optional<TenderingRelease> findByOcid(String ocid);

}
