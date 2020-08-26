package com.datapath.kg.elasticsearchintegration.domain;

import lombok.Data;

@Data
public class ChecklistInfoDTO {

    private Long tenderId;
    private Boolean hasChecklist;
    private Boolean availableForChecklist;
}
