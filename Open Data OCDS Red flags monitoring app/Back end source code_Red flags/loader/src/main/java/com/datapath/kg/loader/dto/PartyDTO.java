package com.datapath.kg.loader.dto;

import lombok.Data;

import java.util.List;

@Data
public class PartyDTO {

    private String id;
    private IdentifierDTO identifier;
    private List<String> roles;
    private AddressDTO address;
}
