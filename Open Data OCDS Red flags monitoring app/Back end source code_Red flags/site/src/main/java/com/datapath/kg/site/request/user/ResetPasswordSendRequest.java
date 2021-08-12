package com.datapath.kg.site.request.user;

import lombok.Data;

import javax.validation.constraints.NotBlank;

import static com.datapath.kg.site.util.Constants.RU_LOCALE;

@Data
public class ResetPasswordSendRequest {

    @NotBlank
    private String path;
    @NotBlank
    private String email;

    private String locale = RU_LOCALE;
}
