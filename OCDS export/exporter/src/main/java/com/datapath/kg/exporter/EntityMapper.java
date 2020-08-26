package com.datapath.kg.exporter;

import com.datapath.kg.common.containers.*;
import com.datapath.kg.exporter.catalogs.dao.CurrencyRateDAO;
import com.datapath.kg.exporter.tendering.dao.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.*;
import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring")
public interface EntityMapper {

    @Mapping(source = "classificationId", target = "classification.id")
    @Mapping(source = "classificationDescription", target = "classification.description")
    @Mapping(source = "classificationScheme", target = "classification.scheme")
    @Mapping(source = "unitId", target = "unit.id")
    @Mapping(source = "unitName", target = "unit.name")
    @Mapping(source = "unitValueAmount", target = "unit.value.amount")
    @Mapping(source = "unitValueCurrency", target = "unit.value.currency")
    Item map(ItemDAO dao);

    BidDetail map(BidDetailDAO dao);

    @Mapping(source = "unitValueAmount", target = "unit.value.amount")
    @Mapping(source = "unitValueCurrency", target = "unit.value.currency")
    PriceProposal map(PriceProposalDAO dao);

    @Mapping(source = "initialAmount", target = "value.initialAmount")
    @Mapping(source = "amount", target = "value.amount")
    @Mapping(source = "currency", target = "value.currency")
    @Mapping(source = "relatedPlanId", target = "relatedPlanID")
    Lot map(LotDAO dao);


    @Mapping(source = "identifierId", target = "identifier.id")
    @Mapping(source = "nameRu", target = "identifier.legalName")
    @Mapping(source = "nameKg", target = "identifier.legalNameKg")
    @Mapping(source = "ateCode", target = "address.ateCode")
    @Mapping(source = "countryName", target = "address.countryName")
    @Mapping(source = "region", target = "address.region")
    @Mapping(source = "subregion", target = "address.subregion")
    @Mapping(source = "district", target = "address.district")
    @Mapping(source = "subdistrict", target = "address.subdistrict")
    @Mapping(source = "streetAddress", target = "address.streetAddress")
    @Mapping(source = "locality", target = "address.locality")
    @Mapping(target = "roles", ignore = true)
    Party map(PartyDAO dao);

    DeliverySchedule map(DeliveryScheduleDAO dao);

    PaymentSchedule map(PaymentScheduleDAO dao);

    RelatedProcess map(RelatedProcessDAO dao);

    List<RelatedProcess> mapProcesses(List<RelatedProcessDAO> daoProcesses);

    @Mapping(source = "valueAmount", target = "value.amount")
    @Mapping(source = "valueCurrency", target = "value.currency")
    @Mapping(source = "relatedLot", target = "relatedLots")
    Award map(AwardDAO dao);

    CurrencyRate map(CurrencyRateDAO dao);

    List<Lot> mapLots(List<LotDAO> daoLots);

    List<Document> mapDocs(List<DocumentDAO> daoDocuments);

    List<Item> mapItems(List<ItemDAO> daoItems);

    @Mapping(source = "amount", target = "value.amount")
    Budget map(BudgetDAO dao);

    static List<String> mapToSingletonList(String input) {
        return Collections.singletonList(input);
    }

    static List<Long> mapToSingletonList(Long input) {
        return Collections.singletonList(input);
    }

    static OffsetDateTime map(String value) {
        if (value == null) return null;
        return OffsetDateTime.of(LocalDate.parse(value), LocalTime.MIDNIGHT, ZoneOffset.UTC);
    }

    static OffsetDateTime map(LocalDateTime value) {
        if (value == null) return null;
        return OffsetDateTime.of(value, ZoneOffset.UTC);
    }
}
