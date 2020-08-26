package com.dpa.kg.portal.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class I18nResponse {

    private List<I18Entry> entries = new ArrayList<>();


}
