package com.datapath.kg.exporter.planning;


import com.datapath.kg.common.containers.*;
import com.datapath.kg.exporter.planning.dao.entity.ItemDAO;
import com.datapath.kg.exporter.planning.dao.entity.PartyDAO;
import com.datapath.kg.exporter.planning.dao.entity.PlanDAO;
import com.datapath.kg.exporter.planning.dao.entity.PlanningDAO;
import com.neovisionaries.i18n.CountryCode;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.toList;

/**
 * Converts planning received from database into OCDS format
 */

@Component
public class PlanningConverter {

    private static final String BUYER = "buyer";

    Planning convert(PlanningDAO dao) {
        Planning planning = new Planning();

        planning.setId(dao.getId());
        planning.setBudgetYear(dao.getBudgetYear());
        planning.setDateCreated(dao.getDateCreated());
        planning.setDateChanged(dao.getDateChanged());
        planning.setStatus(dao.getStatus());
        planning.setType(dao.getType());

        if (dao.getAmount() != null) {
            Value value = new Value();
            value.setAmount(dao.getAmount());
            value.setCurrency(dao.getCurrency());
            planning.setValue(value);
        }

        ProcuringEntity buyer = new ProcuringEntity();
        buyer.setId(dao.getBuyerId());
        buyer.setName(dao.getBuyerName());

        planning.setBuyer(buyer);


        return planning;
    }

    public Plan convert(PlanDAO daoPlan) {
        Plan plan = new Plan();
        plan.setId(daoPlan.getId());
        plan.setAccountNumber(daoPlan.getAccountNumber());
        plan.setAccountName(daoPlan.getAccountName());
        plan.setBudgetLineID(daoPlan.getBudgetLineId());
        plan.setBudgetLineName(daoPlan.getBudgetLineName());
        plan.setDateCreated(daoPlan.getDateCreated());

        if (daoPlan.getAmount() != null
                && daoPlan.getReservedAmount() != null
                && daoPlan.getSavedAmount() != null) {
            Value value = new Value();
            value.setAmount(daoPlan.getAmount());
            value.setReservedAmount(daoPlan.getReservedAmount());
            value.setSavedAmount(daoPlan.getSavedAmount());
            value.setCurrency(daoPlan.getCurrency());
            plan.setValue(value);
        }

        return plan;
    }

    public List<Item> convertItems(List<ItemDAO> daoItems) {
        return daoItems.stream().map(daoItem -> {
            Item item = new Item();
            item.setId(daoItem.getId());

            Classification classification = new Classification();
            classification.setScheme(daoItem.getClassificationScheme());
            classification.setId(daoItem.getClassificationId());
            classification.setDescription(daoItem.getClassificationDescription());
            item.setClassification(classification);

            item.setQuantity(daoItem.getQuantity());

            Unit unit = new Unit();
            unit.setId(daoItem.getUnitId());
            unit.setName(daoItem.getUnitName());

            Value value = new Value();
            value.setAmount(daoItem.getUnitAmount());
            value.setCurrency(daoItem.getUnitCurrency());
            unit.setValue(value);

            item.setUnit(unit);

            return item;
        }).collect(toList());

    }

    public List<Party> convertParties(List<PartyDAO> daoParties) {
        return daoParties.stream().map(this::convert).collect(toList());
    }

    private Party convert(PartyDAO partyDAO) {

        String countryAlpha2 = CountryCode.getByCode(partyDAO.getCountryIsoCode()).getAlpha2();

        Party party = new Party();
        party.setId(countryAlpha2 + "-INN-" + partyDAO.getIdentifierId());

        Identifier identifier = new Identifier();
        identifier.setId(partyDAO.getIdentifierId());
        identifier.setScheme(countryAlpha2 + "-INN");
        identifier.setLegalName(partyDAO.getLegalNameRu());
        identifier.setLegalNameKg(partyDAO.getLegalNameKg());
        party.setIdentifier(identifier);

        Address address = new Address();
        address.setAteCode(partyDAO.getAteCode());
        address.setCountryName(partyDAO.getCountryName());
        address.setDistrict(partyDAO.getDistrict());
        address.setSubdistrict(partyDAO.getSubdistrict());
        address.setSubsubdistrict(partyDAO.getSubsubdistrict());
        address.setLocality(partyDAO.getLocality());
        address.setRegion(partyDAO.getRegion());
        address.setSubregion(partyDAO.getSubregion());
        address.setStreetAddress(partyDAO.getStreetAddress());

        party.setAddress(address);
        party.setRoles(singletonList(BUYER));

        return party;
    }
}
