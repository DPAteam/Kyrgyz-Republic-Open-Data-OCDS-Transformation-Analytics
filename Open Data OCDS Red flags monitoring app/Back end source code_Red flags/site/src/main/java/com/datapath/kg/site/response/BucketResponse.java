package com.datapath.kg.site.response;

import com.datapath.kg.site.dto.BucketListDTO;
import lombok.Data;

import java.util.List;

@Data
public class BucketResponse {

    private List<BucketListDTO> buckets;

    private Long procedureCount;
    private Double procedureAmount;
    private Long riskProcedureCount;
    private Double riskProcedureAmount;
    private Long buyerCount;
    private Long riskBuyerCount;
    private Long indicatorCount;
    private Long riskIndicatorCount;
}
