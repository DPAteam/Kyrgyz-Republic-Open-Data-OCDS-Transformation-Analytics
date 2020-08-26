package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.List;

@Data
public class ProcurementMethodDistribution {

    private List<LongDate> limited;
    private List<LongDate> open;
    private List<LongDate> selective;
    private List<LongDate> direct;

}
