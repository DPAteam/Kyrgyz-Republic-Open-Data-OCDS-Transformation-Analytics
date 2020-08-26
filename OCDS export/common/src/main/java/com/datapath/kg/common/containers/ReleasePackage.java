package com.datapath.kg.common.containers;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class ReleasePackage {

    private String uri;
    private String version;
    private List<String> extensions;
    private OffsetDateTime publishedDate;
    private Publisher publisher;
    private List<TenderingRelease> releases;
    private Links links;

}
