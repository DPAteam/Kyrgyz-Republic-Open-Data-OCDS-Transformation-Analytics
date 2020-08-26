package com.dpa.kg.portal.dao.containers;

import lombok.Data;

@Data
public class WeekTenderDAO {

    private Double amount;
    private String buyer;
    private String number;
    private String procurementMethod;
    private String title;

}
