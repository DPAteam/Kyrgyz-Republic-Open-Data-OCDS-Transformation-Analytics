package com.datapath.kg.loader.handlers;

import com.datapath.kg.loader.dto.ReleaseDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class ReleaseHandler {

    private final ReleasePersistHandler releasePersistHandler;
    private final ReleasePersistFailHandler releasePersistFailHandler;


    public void handle(ReleaseDTO releaseDTO) {
        try {
            releasePersistHandler.handle(releaseDTO);
        } catch (Exception e) {
            releasePersistFailHandler.handle(releaseDTO, e);
        }
    }

}