package com.datapath.kg.exporter.planning;

public interface PlanningEventStore {

    void addProcessedEvent(int id);

    boolean isProcessedEvent(int id);

}
