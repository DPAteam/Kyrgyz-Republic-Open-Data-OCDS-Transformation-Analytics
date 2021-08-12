package com.datapath.kg.site.request.export;

import com.datapath.kg.site.util.Locale;
import lombok.Data;

import java.util.List;

@Data
public class ExportRequest {

    private List<String> tenderIds;

    private Locale locale = Locale.RU;
}
