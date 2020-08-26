package com.datapath.kg.common.containers;

import lombok.Data;

@Data
public class Address {

    private String ateCode;
    private String countryName;
    private String region;
    private String subregion;
    private String district;
    private String subdistrict;
    private String subsubdistrict;
    private String locality;
    private String streetAddress;

}