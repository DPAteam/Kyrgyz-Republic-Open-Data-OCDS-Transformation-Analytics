package com.datapath.kg.exporter.planning;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Component
public class PlanningEventInMemoryStore implements PlanningEventStore {

    private List<Integer> processedEvents;

    @PostConstruct
    private void inti() {
        processedEvents = new ArrayList<>();
    }

    @Override
    public void addProcessedEvent(int id) {
        processedEvents.add(id);
    }

    @Override
    public boolean isProcessedEvent(int id) {
        return processedEvents.contains(id);
    }

}
