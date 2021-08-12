package com.datapath.kg.site.services.export;

import java.util.List;

public interface ExportService {

    byte[] export(List<String> tenderIds, String localeKey);

    byte[] export();
}
