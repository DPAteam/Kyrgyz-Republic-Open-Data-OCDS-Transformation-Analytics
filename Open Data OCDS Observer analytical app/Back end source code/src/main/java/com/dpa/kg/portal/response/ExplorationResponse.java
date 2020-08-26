package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ExplorationResponse {

    private List<ExplorationDay> days = new ArrayList<>();

}
