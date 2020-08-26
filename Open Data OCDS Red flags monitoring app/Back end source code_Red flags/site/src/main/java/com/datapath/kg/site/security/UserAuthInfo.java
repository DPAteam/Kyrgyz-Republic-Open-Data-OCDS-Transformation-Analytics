package com.datapath.kg.site.security;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserAuthInfo {
    private String id;
    private String email;
}
