package com.datapath.kg.exporter.planning.dao.entity;


import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Data
@Entity(name = "planning_event")
public class PlanningEventDAO {

    @Id
    private int id;
    private int planningId;
    private LocalDateTime dateCreated;
    private boolean processed;

}