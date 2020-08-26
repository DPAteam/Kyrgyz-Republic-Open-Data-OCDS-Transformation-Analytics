package com.datapath.kg.loader.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private String region;
    private String district;
    private String locality;
    private String streetAddress;
}
