package com.dpa.kg.portal.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProcurementMethod {

    private String date;
    private Double amount;
    private String name;

}
