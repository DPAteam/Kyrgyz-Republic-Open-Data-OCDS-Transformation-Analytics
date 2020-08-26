package com.datapath.kg.api.dao;

import com.datapath.kg.common.containers.TenderingRelease;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TenderingDAOService {

    public static final String TENDER_NOT_FOUND_MESSAGE = "Tendering release with such ocid not found";
    private final TenderingRepository repository;

    public TenderingRelease save(TenderingRelease release) {
        return repository.save(release);
    }

    public TenderingRelease getRelease(String ocid) {
        return repository.findByOcid(ocid)
                .orElseThrow(() -> new RuntimeException(TENDER_NOT_FOUND_MESSAGE));
    }

    public Optional<TenderingRelease> findByOcid(String ocid) {
        return repository.findByOcid(ocid);
    }

    public Page<TenderingRelease> find(OffsetDateTime offset, int page, int size) {
        return repository.findByDateAfterOrderByDate(offset, PageRequest.of(page, size));
    }

    public void delete(TenderingRelease release) {
        repository.deleteById(release.getId());
    }
}
