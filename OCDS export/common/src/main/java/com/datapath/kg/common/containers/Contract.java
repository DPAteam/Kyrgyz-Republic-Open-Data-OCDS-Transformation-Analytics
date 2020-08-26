package com.datapath.kg.common.containers;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class Contract {

    @Field("id")
    private String id;
    private String contractNumber;
    private OffsetDateTime dateSigned;
    private Value value;
    private List<Long> awardIDs;
    private List<DeliverySchedule> deliveriesSchedule;
    private List<PaymentSchedule> paymentsSchedule;

}
