package com.datapath.kg.common.containers;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenderingPlanning {
    private String rationale;
    private Budget budget;
}