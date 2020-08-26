package com.datapath.kg.loader.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReleasesPage {

    private List<ReleaseDTO> releases;
    private LocalDateTime publishedDate;

}
