package com.datapath.kg.site.services;

import com.datapath.kg.elasticsearchintegration.domain.TenderIndicatorsCommonInfo;
import com.datapath.kg.elasticsearchintegration.services.ProcedureFilterService;
import com.datapath.kg.persistence.entity.BucketEntity;
import com.datapath.kg.persistence.entity.BucketId;
import com.datapath.kg.persistence.service.BucketDaoService;
import com.datapath.kg.site.dto.BucketListDTO;
import com.datapath.kg.site.request.BucketFilterRequest;
import com.datapath.kg.site.request.BucketRequest;
import com.datapath.kg.site.response.BucketResponse;
import com.datapath.kg.site.util.UserUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.*;
import static org.springframework.util.CollectionUtils.isEmpty;

@Service
public class BucketWebService {

    private final BucketDaoService daoService;
    private final ProcedureFilterService service;

    public BucketWebService(BucketDaoService daoService,
                            ProcedureFilterService service) {
        this.daoService = daoService;
        this.service = service;
    }

    public void save(BucketRequest request) {
        Integer userId = UserUtils.getUserId();

        Set<String> existedTenders = daoService.findByUserId(userId)
                .stream()
                .map(b -> b.getId().getTenderId())
                .collect(toSet());

        List<BucketEntity> newEntities = request.getTenderIds()
                .stream()
                .filter(tenderId -> !existedTenders.contains(tenderId))
                .map(tenderId -> new BucketEntity(tenderId, userId))
                .collect(toList());

        daoService.saveAll(newEntities);
    }

    public BucketResponse get(BucketFilterRequest request) {
        BucketResponse response = new BucketResponse();

        List<BucketListDTO> buckets = new LinkedList<>();

        List<BucketEntity> bucketEntities = daoService.findByUserIdAndDates(
                UserUtils.getUserId(),
                request.getStartDate(),
                request.getEndDate()
        );

        if (isEmpty(bucketEntities)) {
            return response;
        }

        List<String> tenderIds = bucketEntities.stream()
                .map(b -> b.getId().getTenderId())
                .collect(toList());

        Map<String, TenderIndicatorsCommonInfo> tenderInfos = new HashMap<>();

        int limit = 100;
        int skip = 0;
        while (skip < tenderIds.size()) {
            List<String> limitTenderIds = tenderIds
                    .stream()
                    .skip(skip)
                    .limit(limit)
                    .collect(toList());

            tenderInfos.putAll(
                    service.getByTenderIds(limitTenderIds)
                            .stream()
                            .collect(toMap(TenderIndicatorsCommonInfo::getTenderId, Function.identity()))
            );

            skip += limit;
        }

        Map<LocalDate, List<BucketEntity>> bucketDateTenders = bucketEntities.stream()
                .collect(Collectors.groupingBy(BucketEntity::getAddedDate));

        bucketDateTenders.forEach((k, v) -> {
            BucketListDTO bucket = new BucketListDTO();

            bucket.setDate(k);
            bucket.setTenders(
                    v.stream()
                            .map(b -> b.getId().getTenderId())
                            .map(tenderInfos::get)
                            .collect(toList())
            );

            buckets.add(bucket);
        });

        response.setBuckets(buckets);

        response.setProcedureCount((long) tenderInfos.size());
        response.setProcedureAmount(getProcedureAmount(tenderInfos.values()));
        response.setRiskProcedureCount(getRiskProcedureCount(tenderInfos.values()));
        response.setRiskProcedureAmount(getRiskProcedureAmount(tenderInfos.values()));
        response.setBuyerCount(getBuyerCount(tenderInfos.values()));
        response.setRiskBuyerCount(getRiskBuyerCount(tenderInfos.values()));
        response.setIndicatorCount(getIndicatorCount(tenderInfos.values()));
        response.setRiskIndicatorCount(getRiskIndicatorCount(tenderInfos.values()));

        return response;
    }

    @Transactional
    public void remove(BucketRequest request) {
        Integer userId = UserUtils.getUserId();

        Set<BucketId> ids = request.getTenderIds()
                .stream()
                .map(tenderId -> new BucketId(userId, tenderId))
                .collect(toSet());

        daoService.deleteByIds(ids);
    }

    private double getProcedureAmount(Collection<TenderIndicatorsCommonInfo> tenders) {
        return tenders.stream()
                .mapToDouble(TenderIndicatorsCommonInfo::getTenderAmount)
                .sum();
    }

    private long getRiskProcedureCount(Collection<TenderIndicatorsCommonInfo> tenders) {
        return tenders.stream()
                .filter(TenderIndicatorsCommonInfo::isWithRisk)
                .count();
    }

    private double getRiskProcedureAmount(Collection<TenderIndicatorsCommonInfo> tenders) {
        return tenders.stream()
                .filter(TenderIndicatorsCommonInfo::isWithRisk)
                .mapToDouble(TenderIndicatorsCommonInfo::getTenderAmount)
                .sum();
    }

    private long getBuyerCount(Collection<TenderIndicatorsCommonInfo> tenders) {
        return tenders.stream()
                .map(TenderIndicatorsCommonInfo::getBuyerId)
                .distinct()
                .count();
    }

    private long getRiskBuyerCount(Collection<TenderIndicatorsCommonInfo> tenders) {
        return tenders.stream()
                .filter(TenderIndicatorsCommonInfo::isWithRisk)
                .map(TenderIndicatorsCommonInfo::getBuyerId)
                .distinct()
                .count();
    }

    private long getIndicatorCount(Collection<TenderIndicatorsCommonInfo> tenders) {
        return tenders.stream()
                .flatMap(t -> t.getIndicators().stream())
                .distinct()
                .count();
    }

    private long getRiskIndicatorCount(Collection<TenderIndicatorsCommonInfo> tenders) {
        return tenders.stream()
                .filter(TenderIndicatorsCommonInfo::isWithRisk)
                .flatMap(t -> t.getIndicatorsWithRisk().stream())
                .distinct()
                .count();
    }
}
