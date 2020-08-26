package com.datapath.kg.exporter.planning;

import com.datapath.kg.common.containers.*;
import com.datapath.kg.exporter.ApiManager;
import com.datapath.kg.exporter.planning.dao.entity.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.datapath.kg.exporter.Constants.OCID_PREFIX;
import static com.datapath.kg.exporter.Constants.PLANNING_TAG;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;

@Component
@Slf4j
@AllArgsConstructor
public class PlanningHandler {

    private final PlanningProvider provider;
    private final PlanningConverter converter;
    private final ApiManager apiManager;
    private final PlanningEventStore eventStore;

    @Scheduled(fixedDelayString = "${planning.delay}")
    public void handle() {
        List<PlanningEventDAO> unprocessedEvents = provider.getUnprocessedEvents();
        unprocessedEvents.forEach(event -> {
            if (!eventStore.isProcessedEvent(event.getId())) {
                try {
                    processEvent(event);
                    eventStore.addProcessedEvent(event.getId());
                } catch (Exception ex) {
                    log.error(ex.getMessage(), ex);
                }
            }
        });
    }

    private void processEvent(PlanningEventDAO event) {
        log.debug("Handle event with planning id {} ", event.getPlanningId());
        PlanningDAO planningDAO = provider.getPlanning(event.getPlanningId());
        List<PlanDAO> daoPlans = provider.getPlans(planningDAO.getId());

        List<Plan> plans = daoPlans.stream().map(this::processPlan).collect(toList());
        Planning planning = converter.convert(planningDAO);
        planning.setPlans(plans);

        List<Party> parties = getParties(event);

        PlanningRelease release = new PlanningRelease();

        release.setOcid(OCID_PREFIX + planning.getId());
        release.setId(String.valueOf(planning.getId()));
        release.setDate(event.getDateCreated().format(DateTimeFormatter.ISO_DATE_TIME));
        release.setTag(singletonList(PLANNING_TAG));
        release.setPlanning(planning);
        release.setParties(parties);

        apiManager.saveRelease(release);
    }

    private List<Party> getParties(PlanningEventDAO event) {
        List<PartyDAO> daoParties = provider.getParties(event.getPlanningId());
        return converter.convertParties(daoParties);
    }


    private Plan processPlan(PlanDAO daoPlan) {
        List<ItemDAO> daoItems = provider.getItems(daoPlan.getId());
        Plan plan = converter.convert(daoPlan);
        List<Item> items = converter.convertItems(daoItems);
        plan.setItems(items);
        return plan;
    }
}
