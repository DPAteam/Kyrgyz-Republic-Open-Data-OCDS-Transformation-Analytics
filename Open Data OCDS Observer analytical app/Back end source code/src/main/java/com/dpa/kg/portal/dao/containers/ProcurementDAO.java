package com.dpa.kg.portal.dao.containers;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProcurementDAO {

    private String buyer;
    private String supplier;
    private String cpv;
    private BigDecimal itemsAmount;
    private String contractNumber;

}
