package com.datapath.kg.exporter.tendering.dao.entity;

import lombok.Data;

import java.sql.Array;

@Data
public class PartyDAO {

    private Integer countryIsoCode;
    private String identifierId;
    private String nameRu;
    private String nameKg;
    private String ateCode;
    private String countryName;
    private String region;
    private String subregion;
    private String district;
    private String subdistrict;
    private String subsubdistrict;
    private String locality;
    private String streetAddress;
    private Integer companyId;

    private Array roles;
}
