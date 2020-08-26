package com.datapath.kg.api;

import com.datapath.kg.common.containers.LegalForm;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class LegalFormsResponse {

    private List<LegalForm> legalForms;

}
