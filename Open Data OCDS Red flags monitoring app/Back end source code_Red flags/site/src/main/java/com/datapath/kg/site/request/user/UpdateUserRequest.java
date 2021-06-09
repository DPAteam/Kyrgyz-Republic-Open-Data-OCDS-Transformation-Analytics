package com.datapath.kg.site.request.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class UpdateUserRequest {

    @Valid
    private List<UpdateUserDataDTO> userUpdates;

    @Data
    @AllArgsConstructor
    public static class UpdateUserDataDTO {
        @NotNull
        private Integer id;
        @NotNull
        private Boolean accountLocked;
    }
}
