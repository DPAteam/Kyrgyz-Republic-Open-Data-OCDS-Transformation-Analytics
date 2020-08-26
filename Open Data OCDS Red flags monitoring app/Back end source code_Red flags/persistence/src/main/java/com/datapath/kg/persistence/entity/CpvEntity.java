package com.datapath.kg.persistence.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity(name = "cpv")
public class CpvEntity {

    @Id
    private String code;
    private String name;
    private String nameEn;
}
