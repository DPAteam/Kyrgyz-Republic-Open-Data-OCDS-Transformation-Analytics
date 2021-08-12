package com.datapath.kg.loader.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class ReleasesPage {

    private List<ReleaseDTO> releases;
    private OffsetDateTime publishedDate;

}
