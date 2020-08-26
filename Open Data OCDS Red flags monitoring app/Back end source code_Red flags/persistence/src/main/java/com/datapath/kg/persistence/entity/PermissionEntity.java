package com.datapath.kg.persistence.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "permission")
@Data
public class PermissionEntity {

    @Id
    private Integer id;
    private String name;
    private String description;
    private String descriptionEn;
}
