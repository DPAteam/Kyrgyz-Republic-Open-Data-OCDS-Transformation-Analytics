package com.datapath.kg.exporter.tendering;

import com.datapath.kg.common.containers.*;
import com.datapath.kg.exporter.EntityMapper;
import com.datapath.kg.exporter.tendering.dao.entity.*;
import com.neovisionaries.i18n.CountryCode;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static com.datapath.kg.exporter.Constants.OCID_PREFIX;
import static com.datapath.kg.exporter.Constants.TENDER_INITIATION_TYPE;
import static com.datapath.kg.exporter.Constants.Tag.*;
import static java.util.Collections.singletonList;
import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;
import static org.springframework.util.CollectionUtils.isEmpty;

//fixme replace manual converting by mapstruct if need or possible

/**
 * Converts releases from database into OCDS releases
 */
@Component
@AllArgsConstructor
public class TenderingConverter {

    private static final String INN = "-INN-";
    private static final String CONTRACT_BASED = "contract-based-";
    private static final ZoneOffset BISHKEK_OFFSET = ZoneOffset.of("+6");

    private final EntityMapper mapper;

    public TenderingRelease toRelease(ReleaseDAO releaseDAO) {

        TenderingRelease release = new TenderingRelease();
        TenderDAO tenderDAO = releaseDAO.getTender();

        release.setOcid(OCID_PREFIX + (releaseDAO.isContractBased() ? CONTRACT_BASED : "") + tenderDAO.getId());
        release.setTag(getTags(releaseDAO));
        release.setDate(OffsetDateTime.now().withOffsetSameLocal(BISHKEK_OFFSET));
        release.setId(OCID_PREFIX + release.getTag().get(0) + "-" + release.getDate().toLocalDate() + "-" + tenderDAO.getId());
        release.setInitiationType(TENDER_INITIATION_TYPE);
        release.setParties(toParties(releaseDAO.getParties()));

        List<BidDetail> bidDetails = toBidDetails(releaseDAO.getBids());
        if (!isEmpty(bidDetails)) {
            release.setBids(new Bids(bidDetails));
        }

        release.setComplaints(toComplaints(releaseDAO.getComplaints()));
        release.setContracts(toContracts(releaseDAO.getContracts()));
        release.setAwards(toAwards(releaseDAO.getAwards()));

        Tender tender = toTender(tenderDAO);
        release.setTender(tender);

        release.setRelatedProcesses(toProcesses(releaseDAO.getRelatedProcesses()));
        release.setPlanning(getPlanning(releaseDAO.getBudget()));

        clearEmptyValueObject(release);

        return release;
    }

    // https://dpa.atlassian.net/browse/KIFMPATPI-123
    private void clearEmptyValueObject(TenderingRelease release) {
        Tender tender = release.getTender();

        if (!isEmpty(release.getAwards())) {
            release.getAwards().forEach(award -> {
                if (award.getValue() != null) {
                    if (award.getValue().isEmpty()) {
                        award.setValue(null);
                    }
                }
            });
        }

        if (!isEmpty(release.getContracts())) {
            release.getContracts().forEach(contract -> {
                if (contract.getValue() != null) {
                    if (contract.getValue().isEmpty()) {
                        contract.setValue(null);
                    }
                }
            });
        }

        if (!isEmpty(tender.getLots())) {
            tender.getLots().forEach(lot -> {
                if (lot.getValue() != null && lot.getValue().isEmpty()) {
                    lot.setValue(null);
                }
            });
        }

        if (tender.getValue() != null) {
            if (tender.getValue().isEmpty()) {
                tender.setValue(null);
            }
        }

        if (tender.getItems() != null) {
            tender.getItems().forEach(item -> {
                if (item.getUnit() != null && item.getUnit().getValue() != null) {
                    if (item.getUnit().getValue().isEmpty()) {
                        item.getUnit().setValue(null);
                    }
                }
            });
        }

        if (release.getBids() != null) {
            if (!isEmpty(release.getBids().getDetails())) {
                release.getBids().getDetails().forEach(bidDetail -> {
                    if (!isEmpty(bidDetail.getPriceProposal())) {
                        bidDetail.getPriceProposal().forEach(priceProposal -> {
                            if (priceProposal.getUnit() != null && priceProposal.getUnit().getValue() != null) {
                                if (priceProposal.getUnit().getValue().isEmpty()) {
                                    priceProposal.getUnit().setValue(null);
                                }
                            }
                        });
                    }

                    if (!isEmpty(bidDetail.getRelatedLots())) {
                        bidDetail.getRelatedLots().forEach(lot -> {
                            if (lot.getValue() != null && lot.getValue().isEmpty()) {
                                lot.setValue(null);
                            }
                        });
                    }
                });
            }
        }

        if (release.getPlanning() != null) {

            Value value = release.getPlanning().getBudget().getValue();
            if (value != null && value.isEmpty()) {
                release.getPlanning().getBudget().setValue(null);
            }
        }

    }

    private List<String> getTags(ReleaseDAO release) {
        List<String> tags = new ArrayList<>();
        tags.add(TENDER);
        if (!isEmpty(release.getAwards())) tags.add(AWARD);
        if (!isEmpty(release.getContracts())) tags.add(CONTRACT);

        return tags;
    }

    private TenderingPlanning getPlanning(BudgetDAO budgetDAO) {
        if (budgetDAO == null) return null;

        Budget budget = mapper.map(budgetDAO);

        TenderingPlanning planning = new TenderingPlanning();
        planning.setBudget(budget);
        planning.setRationale(budgetDAO.getRationale());
        return planning;
    }

    private List<RelatedProcess> toProcesses(List<RelatedProcessDAO> daoProcesses) {
        if (isEmpty(daoProcesses)) return null;
        return mapper.mapProcesses(daoProcesses);
    }

    //fixme move method to mapper
    private List<Award> toAwards(List<AwardDAO> daoAwards) {
        if (isEmpty(daoAwards)) return null;
        return daoAwards.stream().map(mapper::map).collect(toList());
    }

    private List<Contract> toContracts(List<ContractDAO> daoContracts) {
        if (isEmpty(daoContracts)) return null;
        return daoContracts.stream().map(this::toContract).collect(toList());
    }

    private Contract toContract(ContractDAO dao) {
        Contract api = new Contract();
        api.setId(dao.getId() + (dao.getType() != null ? dao.getType() : ""));
        api.setContractNumber(dao.getContractNumber());
        //fixme move all conversion to mapper
        api.setDateSigned(EntityMapper.map(dao.getDateSigned()));

        Value value = new Value();
        value.setAmount(dao.getAmount());
        value.setAmountDiscounted(dao.getAmountDiscounted());
        value.setCurrency(dao.getCurrency());
        api.setValue(value);

        api.setAwardIDs(dao.getAwardIDs());
        api.setDeliveriesSchedule(toDeliverySchedules(dao.getDeliveriesSchedule()));
        api.setPaymentsSchedule(toPaymentsSchedule(dao.getPaymentsSchedule()));
        return api;
    }

    private List<DeliverySchedule> toDeliverySchedules(List<DeliveryScheduleDAO> daoSchedules) {
        if (isEmpty(daoSchedules)) return null;
        return daoSchedules.stream().map(mapper::map).collect(toList());
    }

    private List<PaymentSchedule> toPaymentsSchedule(List<PaymentScheduleDAO> daoPayments) {
        if (isEmpty(daoPayments)) return null;
        return daoPayments.stream().map(mapper::map).collect(toList());
    }

    private Tender toTender(TenderDAO tenderDAO) {
        Tender tender = new Tender();
        tender.setId(tenderDAO.getId());
        tender.setTitle(tenderDAO.getTitle());
        tender.setTenderNumber(tenderDAO.getTenderNumber());
        tender.setStatus(tenderDAO.getStatus());
        tender.setStatusDetails(tenderDAO.getStatusDetails());
        tender.setDatePublished(EntityMapper.map(tenderDAO.getDatePublished()));
        tender.setDate(EntityMapper.map(tenderDAO.getDate()));
        tender.setProcurementMethod(tenderDAO.getProcurementMethod());
        tender.setProcurementMethodDetails(tenderDAO.getProcurementMethodDetails());
        tender.setProcurementMethodRationale(tenderDAO.getProcurementMethodRationale());
        tender.setProcurementSubMethodDetails(tenderDAO.getProcurementSubMethodDetails());
        tender.setHasExternalSystem(tenderDAO.getHasExternalSystem());
        tender.setHasPrequalification(tenderDAO.getHasPrequalification() != null ? tenderDAO.getHasPrequalification() : false);

        if (tenderDAO.getGuaranteeAmount() != null) {
            Guarantee guarantee = new Guarantee();
            guarantee.setAmount(tenderDAO.getGuaranteeAmount());
            guarantee.setMonetary(tenderDAO.getGuaranteeMonetary());
            tender.setGuarantee(guarantee);
        }

        if (tenderDAO.getValueAmount() != null) {
            Value value = new Value();
            value.setAmount(tenderDAO.getValueAmount());
            value.setCurrency(tenderDAO.getValueCurrency());
            tender.setValue(value);
        }

        if (tenderDAO.getStartDate() != null && tenderDAO.getEndDate() != null) {
            Period tenderPeriod = new Period();
            tenderPeriod.setStartDate(EntityMapper.map(tenderDAO.getStartDate()));
            tenderPeriod.setEndDate(EntityMapper.map(tenderDAO.getEndDate()));
            tender.setTenderPeriod(tenderPeriod);
        }

        if (tenderDAO.getEnquiryStartDate() != null && tenderDAO.getEnquiryEndDate() != null) {
            Period enquiryPeriod = new Period();
            enquiryPeriod.setStartDate(EntityMapper.map(tenderDAO.getEnquiryStartDate()));
            enquiryPeriod.setEndDate(EntityMapper.map(tenderDAO.getEndDate()));
            tender.setEnquiryPeriod(enquiryPeriod);
        }

        tender.setConditionOfContract(toConditionOfContract(tenderDAO.getConditionOfContact()));
        tender.setItems(toItems(tenderDAO.getItems()));
        tender.setLots(toLots(tenderDAO.getLots()));
        tender.setQualificationRequirements(toQualificationRequirements(tenderDAO.getQualificationRequirements()));
        tender.setEnquiries(toEnquiries(tenderDAO.getEnquiries()));
        tender.setDocuments(toDocuments(tenderDAO.getDocuments()));

        if (tenderDAO.getProcuringEntityId() != null) {
            String countryAlpha2 = CountryCode.getByCode(tenderDAO.getCountryIsoCode()).getAlpha2();
            String procuringEntityId = countryAlpha2 + INN + tenderDAO.getProcuringEntityId();
            ProcuringEntity procuringEntity = new ProcuringEntity();
            procuringEntity.setId(procuringEntityId);
            procuringEntity.setId(tenderDAO.getProcuringEntityName());
            tender.setProcuringEntity(procuringEntity);
        }
        tender.setMainProcurementCategory(tenderDAO.getMainProcurementCategory());

        return tender;
    }

    private List<Lot> toLots(List<LotDAO> lots) {
        if (isEmpty(lots)) return null;
        return mapper.mapLots(lots);
    }

    private List<Enquiry> toEnquiries(List<EnquiryDAO> daoEnquiries) {
        if (isEmpty(daoEnquiries)) return null;

        return daoEnquiries.stream().map(this::toEnquiry).collect(toList());
    }

    private Enquiry toEnquiry(EnquiryDAO dao) {
        Enquiry dto = new Enquiry();
        dto.setId(String.valueOf(dao.getId()));
        dto.setDate(EntityMapper.map(dao.getDate()));
        dto.setDescription(dao.getDescription());

        if (dao.getAuthorId() != null) {
            String countryAlpha2 = CountryCode.getByCode(dao.getCountryIsoCode()).getAlpha2();
            String authorId = countryAlpha2 + INN + dao.getAuthorId();
            dto.setAuthor(new Author(authorId));
        }

        dto.setDateAnswered(EntityMapper.map(dao.getDateAnswered()));
        dto.setAnswer(dao.getAnswer());

        return dto;
    }

    private ConditionOfContract toConditionOfContract(ConditionOfContractDAO dao) {
        if (dao == null) return null;
        ConditionOfContract result = new ConditionOfContract();
        result.setId(dao.getId());
        result.setLateDeliveryRate(dao.getLateDeliveryRate());
        result.setLatePaymentRate(dao.getLatePaymentRate());
        result.setLateGuaranteeRate(dao.getLateGuaranteeRate());
        result.setGuaranteePercent(dao.getGuaranteePercent());
        result.setMaxDeductibleAmountDelivery(dao.getMaxDeductibleAmountDelivery());
        result.setMaxDeductibleAmountPayment(dao.getMaxDeductibleAmountPayment());
        result.setMaxDeductibleAmountGuarantee(dao.getMaxDeductibleAmountGuarantee());
        result.setHasGuarantee(dao.getHasGuarantee());
        result.setHasInsurance(dao.getHasInsurance());
        result.setHasRelatedServices(dao.getHasRelatedServices());
        result.setHasSpares(dao.getHasSpares());
        result.setHasTechnicalControl(dao.getHasTechnicalControl());
        result.setHasPrepayment(dao.getHasPrepayment());
        result.setHasAcceptancePayment(dao.getHasAcceptancePayment());
        result.setHasShipmentPayment(dao.getHasShipmentPayment());
        result.setPrepaymentPercent(dao.getPrepaymentPercent());
        result.setAcceptancePaymentPercent(dao.getAcceptancePaymentPercent());
        result.setShipmentPaymentPercent(dao.getShipmentPaymentPercent());
        result.setInsuranceType(dao.getInsuranceType());
        result.setHasArbitralTribunal(dao.getHasArbitralTribunal());
        return result;
    }

    private List<QualificationRequirement> toQualificationRequirements(List<QualificationRequirementDAO> daoRequirements) {
        if (isEmpty(daoRequirements)) return null;
        return daoRequirements.stream().map(this::toQualificationRequirement).collect(toList());
    }

    private QualificationRequirement toQualificationRequirement(QualificationRequirementDAO dao) {
        QualificationRequirement dto = new QualificationRequirement();
        dto.setId(dao.getId());
        dto.setType(dao.getType());
        dto.setTypeDetails(dao.getTypeDetails());
        return dto;
    }

    private List<Complaint> toComplaints(List<ComplaintDAO> daoComplaints) {
        if (isEmpty(daoComplaints)) return null;
        return daoComplaints.stream().map(this::toComplaint).collect(toList());
    }

    private Complaint toComplaint(ComplaintDAO dao) {
        Complaint dto = new Complaint();
        dto.setId(dao.getId());
        dto.setStatus(dao.getStatus());
        dto.setDateSubmitted(dao.getDateSubmitted());
        dto.setType(dao.getType());
        dto.setComplaintNumber(dao.getComplaintNumber());
        dto.setTitle(dao.getTitle());
        dto.setDescription(dao.getDescription());

        String countryAlpha2 = CountryCode.getByCode(dao.getCountryIsoCode()).getAlpha2();
        String authorId = countryAlpha2 + INN + dao.getAuthorId();
        dto.setAuthor(new Author(authorId));

        dto.setReviewDate(dao.getReviewDate());
        dto.setResponseDate(dao.getResponseDate());

        dto.setDocuments(toDocuments(dao.getDocuments()));

        dto.setResolution(dao.getResolution());

        return dto;
    }

    private List<Document> toDocuments(List<DocumentDAO> daoDocuments) {
        if (isEmpty(daoDocuments)) return null;
        return mapper.mapDocs(daoDocuments);
    }

    private List<Item> toItems(List<ItemDAO> daoItems) {
        if (isEmpty(daoItems)) return null;
        return mapper.mapItems(daoItems);
    }

    private List<BidDetail> toBidDetails(List<BidDetailDAO> daoDetails) {
        if (isEmpty(daoDetails)) return null;
        return daoDetails.stream().map(this::toBidDetail).collect(toList());
    }

    private BidDetail toBidDetail(BidDetailDAO dao) {
        BidDetail dto = mapper.map(dao);
        Party tenderer = new Party();
        String countryAlpha2 = CountryCode.getByCode(dao.getCountryIsoCode()).getAlpha2();
        tenderer.setId(countryAlpha2 + INN + dao.getTendererId());
        dto.setTenderers(singletonList(tenderer));
        return dto;
    }

    private List<Party> toParties(List<PartyDAO> daoParties) {

        List<Party> allParties = daoParties.stream().map(dao -> {
            try {
                Party dto = mapper.map(dao);
                String countryAlpha2 = CountryCode.getByCode(dao.getCountryIsoCode()).getAlpha2();
                dto.setId(countryAlpha2 + INN + dao.getIdentifierId());
                dto.getIdentifier().setScheme(countryAlpha2 + "-INN");
                dto.setRoles(Arrays.asList((String[]) dao.getRoles().getArray()));
                return dto;
            } catch (SQLException ex) {
                throw new RuntimeException(ex.getMessage(), ex);
            }
        }).collect(toList());

        //need to combine roles for each duplicated party
        Map<String, List<Party>> uniqueParties = allParties.stream().collect(groupingBy(Party::getId, toList()));
        return uniqueParties.keySet().stream().map(partyId -> {
            Party first = uniqueParties.get(partyId).get(0);
            List<String> roles = uniqueParties.get(partyId).stream().flatMap(party -> party.getRoles().stream()).collect(toList());
            first.setRoles(roles);
            return first;
        }).collect(toList());
    }
}
