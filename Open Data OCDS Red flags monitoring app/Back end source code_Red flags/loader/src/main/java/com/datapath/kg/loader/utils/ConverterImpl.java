package com.datapath.kg.loader.utils;

import com.datapath.kg.loader.DataMapper;
import com.datapath.kg.loader.dao.entity.*;
import com.datapath.kg.loader.dto.PartyDTO;
import com.datapath.kg.loader.dto.ReleaseDTO;
import com.datapath.kg.loader.dto.TenderDTO;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.datapath.kg.loader.utils.Constants.*;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.springframework.util.CollectionUtils.isEmpty;

@Component
public class ConverterImpl implements Converter {

    private DataMapper mapper;

    public ConverterImpl(DataMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public PartyEntity convert(PartyDTO partyDTO) {
        return mapper.map(partyDTO);
    }

    @Override
    public ReleaseEntity convert(ReleaseDTO releaseDTO) {
        TenderDTO tenderDTO = releaseDTO.getTender();

        ReleaseEntity releaseEntity = mapper.map(releaseDTO);

        TenderEntity tenderEntity = releaseEntity.getTender();
        tenderEntity.setBadQuality(isBadQuality(releaseDTO));
        tenderEntity.setRelease(releaseEntity);

        if (!isEmpty(tenderEntity.getQualificationRequirements())) {
            tenderEntity.getQualificationRequirements()
                    .forEach(qr -> qr.setTender(tenderEntity));
        }

        if (!isEmpty(tenderEntity.getEnquiries())) {
            tenderEntity.getEnquiries()
                    .forEach(e -> e.setTender(tenderEntity));
        }

        if (!isEmpty(tenderEntity.getLots())) {
            tenderEntity.getLots().forEach(lot ->
                    lot.setTender(tenderEntity)
            );
        }

        if (!isEmpty(tenderEntity.getComplaints())) {
            tenderEntity.getComplaints().forEach(complaint ->
                    complaint.setTender(tenderEntity)
            );
        }

        if (!isEmpty(tenderEntity.getDocuments())) {
            tenderEntity.getDocuments().forEach(documents ->
                    documents.setTender(tenderEntity)
            );
        }

        if (!isEmpty(releaseDTO.getRelatedProcesses())) {
            Set<RelatedProcessEntity> relatedProcesses = IntStream
                    .range(0, releaseDTO.getRelatedProcesses().size())
                    .mapToObj(i -> {
                        RelatedProcessEntity entity = mapper.map(releaseDTO.getRelatedProcesses().get(i));
                        entity.setId(i + "-" + tenderEntity.getRelease().getOcid());
                        entity.setTender(tenderEntity);
                        return entity;
                    }).collect(Collectors.toSet());
            tenderEntity.setRelatedProcesses(relatedProcesses);
        }

        if (nonNull(tenderEntity.getConditionOfContract())) {
            tenderEntity.getConditionOfContract().setTender(tenderEntity);
        }

        processItems(tenderEntity, tenderDTO);
        processAwards(releaseEntity, releaseDTO);
        processBids(tenderEntity, releaseDTO);
        processContracts(tenderEntity);
        processDocuments(tenderEntity, tenderDTO);

        return releaseEntity;
    }

    private void processDocuments(TenderEntity tenderEntity, TenderDTO tenderDTO) {
        if (!isEmpty(tenderDTO.getDocuments())) {
            tenderEntity.getDocuments().forEach(document -> {
                tenderDTO.getDocuments().stream()
                        .filter(documentDTO -> documentDTO.getId().equals(document.getId()))
                        .findFirst()
                        .ifPresent(documentDTO -> {
                            if (!isEmpty(tenderEntity.getLots()) && !isEmpty(documentDTO.getRelatedLots())) {
                                tenderEntity.getLots().stream()
                                        .filter(lot -> lot.getOuterId().equals(documentDTO.getRelatedLots().get(0)))
                                        .findFirst()
                                        .ifPresent(document::setLot);
                            }
                            if (!isEmpty(tenderEntity.getItems()) && !isEmpty(documentDTO.getRelatedItems())) {
                                tenderEntity.getItems().stream()
                                        .filter(item -> item.getOuterId().equals(documentDTO.getRelatedItems().get(0)))
                                        .findFirst()
                                        .ifPresent(document::setItem);
                            }
                        });
            });
        }
    }

    private void processContracts(TenderEntity tenderEntity) {
        if (isEmpty(tenderEntity.getContracts())) return;
        tenderEntity.getContracts().forEach(contract -> contract.setTender(tenderEntity));
    }

    private void processAwards(ReleaseEntity releaseEntity, ReleaseDTO releaseDTO) {
        TenderEntity tenderEntity = releaseEntity.getTender();
        if (!isEmpty(tenderEntity.getAwards())) {
            tenderEntity.getAwards().forEach(award -> award.setTender(tenderEntity));
        }

        if (!isEmpty(releaseDTO.getAwards())) {

            releaseDTO.getAwards().forEach(awardDTO -> {
                if (!isEmpty(awardDTO.getRelatedLots())) {

                    tenderEntity.getAwards().stream().filter(awardEntity -> awardEntity.getOuterId().equals(awardDTO.getId())).findFirst().ifPresent(awardEntity -> {

                        tenderEntity.getLots().stream().filter(lot -> lot.getOuterId().equals(awardDTO.getRelatedLots().get(0))).findFirst().ifPresent(lot -> {
                            lot.getAwards().add(awardEntity);
                            awardEntity.setLot(lot);
                        });

                    });

                }

                if (nonNull(awardDTO.getRelatedBid())) {
                    tenderEntity.getAwards().stream().filter(awardEntity -> awardEntity.getOuterId().equals(awardDTO.getId())).findFirst().ifPresent(awardEntity -> {

                        tenderEntity.getBids().stream().filter(bid -> bid.getId().equals(awardDTO.getRelatedBid()))
                                .findFirst()
                                .ifPresent(awardEntity::setBid);
                    });
                }
            });
        }
    }

    private void processItems(TenderEntity tenderEntity, TenderDTO tenderDTO) {
        if (isEmpty(tenderDTO.getItems())) return;

        tenderEntity.getItems().forEach(item -> item.setTender(tenderEntity));

        tenderDTO.getItems().forEach(itemDTO -> tenderEntity.getItems().stream()
                .filter(itemEntity -> itemEntity.getOuterId().equals(itemDTO.getId()))
                .findFirst()
                .ifPresent(itemEntity -> tenderEntity.getLots().stream().filter(lot -> lot.getOuterId().equals(itemDTO.getRelatedLot())).findFirst().ifPresent(lot -> {
                    lot.getItems().add(itemEntity);
                    itemEntity.setLot(lot);
                })));

    }

    private void processBids(TenderEntity tenderEntity, ReleaseDTO releaseDTO) {
        if (!isEmpty(tenderEntity.getBids())) {
            tenderEntity.getBids().forEach(bid -> bid.setTender(tenderEntity));

            tenderEntity.getBids().forEach(bid -> releaseDTO.getBids().getDetails().stream()
                    .filter(bidDTO -> bid.getId().equals(bidDTO.getId()))
                    .findFirst()
                    .ifPresent(bidDTO -> {
                                bid.setTendererId(bidDTO.getTenderers().get(0).getId());

                                if (!isEmpty(tenderEntity.getLots()) && !isEmpty(bidDTO.getRelatedLots())) {
                                    bidDTO.getRelatedLots().forEach(relatedLot -> {
                                                tenderEntity.getLots().stream()
                                                        .filter(lot -> lot.getOuterId().equals(relatedLot.getId()))
                                                        .findFirst()
                                                        .ifPresent(lot -> {
                                                            bid.getBidLots().add(
                                                                    new BidLotEntity(bid, lot,
                                                                            nonNull(relatedLot.getValue().getAmount()) ?
                                                                                    relatedLot.getValue().getAmount() :
                                                                                    relatedLot.getValue().getInitialAmount()
                                                                    )
                                                            );
                                                        });
                                            }
                                    );
                                }
                            }
                    ));

            tenderEntity.getBids().forEach(bid -> {
                if (!isEmpty(bid.getPriceProposal())) {
                    bid.getPriceProposal().clear();
                }
                releaseDTO.getBids().getDetails().stream()
                        .filter(bidDTO -> bid.getId().equals(bidDTO.getId()) && !isEmpty(bidDTO.getPriceProposal()))
                        .findFirst()
                        .ifPresent(bidDTO -> bidDTO.getPriceProposal().forEach(pp -> {
                            PriceProposalEntity proposalEntity = mapper.map(pp);
                            proposalEntity.setBid(bid);

                            if (!isEmpty(tenderEntity.getLots())) {
                                tenderEntity.getLots().stream()
                                        .filter(lot -> lot.getOuterId().equals(pp.getRelatedLot()))
                                        .findFirst()
                                        .ifPresent(lot -> {
                                            lot.getPriceProposal().add(proposalEntity);
                                            proposalEntity.setLot(lot);
                                        });
                            }
                            if (!isEmpty(tenderEntity.getItems())) {
                                tenderEntity.getItems().stream()
                                        .filter(item -> item.getOuterId().equals(pp.getRelatedItem()))
                                        .findFirst()
                                        .ifPresent(item -> {
                                            item.getPriceProposal().add(proposalEntity);
                                            proposalEntity.setItem(item);
                                        });
                            }
                            bid.getPriceProposal().add(proposalEntity);
                        }));
            });
        }
    }

    private boolean isBadQuality(ReleaseDTO releaseDTO) {
        return existBidRelatedLotsWithoutLots(releaseDTO) ||
                isActiveTenderWithoutActiveLots(releaseDTO);
    }

    private boolean existBidRelatedLotsWithoutLots(ReleaseDTO releaseDTO) {
        if (isNull(releaseDTO.getBids()) || isEmpty(releaseDTO.getBids().getDetails())) return false;

        boolean existBidRelatedLots = releaseDTO.getBids().getDetails()
                .stream()
                .anyMatch(b -> !isEmpty(b.getRelatedLots()));

        return existBidRelatedLots && isEmpty(releaseDTO.getTender().getLots());
    }

    private boolean isActiveTenderWithoutActiveLots(ReleaseDTO releaseDTO) {
        if (!ACTIVE.equals(releaseDTO.getTender().getStatus()) ||
                isEmpty(releaseDTO.getTender().getLots())) return false;

        boolean existActiveLot = releaseDTO.getTender().getLots()
                .stream()
                .anyMatch(lot -> !CANCELLED.equals(lot.getStatus()) &&
                        !UNSUCCESSFUL.equals(lot.getStatus())
                );

        return !existActiveLot;
    }
}
