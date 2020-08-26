package com.dpa.kg.portal.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class I18Entry {

    private String key;
    private String ru;
    private String en;
    private String ky;

}
