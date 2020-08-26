package com.datapath.kg.loader;

import com.datapath.kg.loader.dao.entity.*;
import com.datapath.kg.loader.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {LocalDateTimeMapper.class})
public interface DataMapper {

    @Mapping(target = "tender.awards", source = "awards")
    @Mapping(target = "tender.complaints", source = "complaints")
    @Mapping(target = "tender.bids", source = "bids.details")
    @Mapping(target = "tender.contracts", source = "contracts")
    @Mapping(ignore = true, target = "tender.id")
    @Mapping(target = "tender", source = "tender")
    @Mapping(target = "tender.outerId", source = "tender.id")
    @Mapping(target = "tender.amount", source = "tender.value.amount")
    @Mapping(target = "tender.currency", source = "tender.value.currency")
    @Mapping(target = "tender.periodStartDate", source = "tender.tenderPeriod.startDate")
    @Mapping(target = "tender.periodEndDate", source = "tender.tenderPeriod.endDate")
    ReleaseEntity map(ReleaseDTO dto);

    @Mapping(ignore = true, target = "id")
    @Mapping(target = "outerId", source = "id")
    @Mapping(target = "identifierId", source = "identifier.id")
    @Mapping(target = "identifierScheme", source = "identifier.scheme")
    @Mapping(target = "identifierLegalName", source = "identifier.legalName")
    @Mapping(target = "identifierLegalNameKg", source = "identifier.legalName_kg")
    @Mapping(target = "district", source = "address.district")
    @Mapping(target = "locality", source = "address.locality")
    @Mapping(target = "streetAddress", source = "address.streetAddress")
    @Mapping(target = "region", source = "address.region")
    PartyEntity map(PartyDTO dto);

    @Mapping(ignore = true, target = "id")
    @Mapping(target = "outerId", source = "id")
    @Mapping(target = "valueAmount", source = "value.amount")
    @Mapping(target = "valueCurrency", source = "value.currency")
    LotEntity map(LotDTO dto);

    @Mapping(ignore = true, target = "id")
    @Mapping(target = "outerId", source = "id")
    @Mapping(target = "classificationId", source = "classification.id")
    @Mapping(target = "classificationScheme", source = "classification.scheme")
    @Mapping(target = "unitId", source = "unit.id")
    @Mapping(target = "unitName", source = "unit.name")
    @Mapping(target = "unitValueAmount", source = "unit.value.amount")
    @Mapping(target = "unitValueCurrency", source = "unit.value.currency")
    ItemEntity map(ItemDTO dto);

    @Mapping(ignore = true, target = "id")
    @Mapping(target = "outerId", source = "id")
    @Mapping(target = "valueAmount", source = "value.amount")
    @Mapping(target = "valueCurrency", source = "value.currency")
    AwardEntity map(AwardDTO dto);

    @Mapping(target = "relationship", expression = "java(dto.getRelationship().get(0))")
    RelatedProcessEntity map(RelatedProcessDTO dto);

    @Mapping(target = "unitValueAmount", source = "unit.value.amount")
    @Mapping(target = "unitValueCurrency", source = "unit.value.currency")
    PriceProposalEntity map(PriceProposalDTO dto);

    @Mapping(ignore = true, target = "id")
    @Mapping(target = "outerId", source = "id")
    @Mapping(target = "valueAmount", source = "value.amount")
    ContractEntity map(ContractDTO dto);
}
