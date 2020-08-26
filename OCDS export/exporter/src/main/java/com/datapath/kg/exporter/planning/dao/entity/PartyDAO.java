package com.datapath.kg.exporter.planning.dao.entity;

import lombok.Data;

import java.sql.Array;

@Data
public class PartyDAO {

    private Integer countryIsoCode;
    private String identifierId;
    private String legalNameRu;
    private String legalNameKg;
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
