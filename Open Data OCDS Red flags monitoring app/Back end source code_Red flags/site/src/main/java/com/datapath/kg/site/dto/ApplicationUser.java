package com.datapath.kg.site.dto;


import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ApplicationUser {
    private Long id;
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
