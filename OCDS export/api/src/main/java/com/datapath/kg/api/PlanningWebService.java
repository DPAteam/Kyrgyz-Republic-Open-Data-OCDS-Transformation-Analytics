package com.datapath.kg.api;

import com.datapath.kg.api.dao.PlanningRepository;
import com.datapath.kg.common.containers.IdResponse;
import com.datapath.kg.common.containers.PlanningRelease;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class PlanningWebService {

    @Autowired
    private PlanningRepository planningRepository;


    public IdResponse addRelease(PlanningRelease release) {
        planningRepository.save(release);
        return new IdResponse(release.getId());
    }

    public PlanningRelease getRelease(String id) {
        return planningRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planning release with such id not found"));
    }


    public Page<PlanningRelease> getReleases(String offset, Integer page, Integer size) {
        return planningRepository.findByDateAfterOrderByDate(offset, PageRequest.of(page, size));
    }
}