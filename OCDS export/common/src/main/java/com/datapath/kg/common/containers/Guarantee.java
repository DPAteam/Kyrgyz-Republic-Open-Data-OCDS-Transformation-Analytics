package com.datapath.kg.common.containers;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Guarantee {

    private Double amount;
    private Boolean monetary;

}
