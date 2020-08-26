package com.datapath.kg.loader.handlers;

import com.datapath.kg.loader.dao.entity.PartyEntity;
import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import com.datapath.kg.loader.dao.repository.ReleaseRepository;
import com.datapath.kg.loader.dao.service.PartyDAOService;
import com.datapath.kg.loader.dto.PartyDTO;
import com.datapath.kg.loader.dto.ReleaseDTO;
import com.datapath.kg.loader.utils.Converter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static java.util.Objects.nonNull;
import static org.springframework.util.CollectionUtils.isEmpty;

@Component
@Slf4j
public class ReleasePersistHandler {

    private static final String BUYER = "buyer";
    private static final String SUPPLIER = "supplier";
    private static final String TENDERER = "tenderer";

    @Autowired
    private PartyDAOService partyDAOService;
    @Autowired
    private ReleaseRepository releaseRepository;
    @Autowired
    private Converter converter;

    @Transactional
    public void handle(ReleaseDTO releaseDTO) {
        log.info("Save release - {}", releaseDTO.getOcid());

        ReleaseEntity releaseEntity = converter.convert(releaseDTO);

        ReleaseEntity existedReleaseEntity = releaseRepository.findByOcid(releaseEntity.getOcid());
        if (nonNull(existedReleaseEntity)) {
            releaseEntity.getTender().setId(existedReleaseEntity.getTender().getId());

            if (!isEmpty(existedReleaseEntity.getTender().getLots())) {
                releaseEntity.getTender().getLots()
                        .forEach(lot -> {
                            existedReleaseEntity.getTender().getLots()
                                    .stream()
                                    .filter(existed -> existed.getOuterId().equals(lot.getOuterId()))
                                    .findFirst()
                                    .ifPresent(existed -> lot.setId(existed.getId()));
                        });
            }

            if (!isEmpty(existedReleaseEntity.getTender().getContracts())) {
                releaseEntity.getTender().getContracts()
                        .forEach(contract -> {
                            existedReleaseEntity.getTender().getContracts()
                                    .stream()
                                    .filter(existed -> existed.getOuterId().equals(contract.getOuterId()))
                                    .findFirst()
                                    .ifPresent(existed -> contract.setId(existed.getId()));
                        });
            }

            if (!isEmpty(existedReleaseEntity.getTender().getAwards())) {
                releaseEntity.getTender().getAwards()
                        .forEach(award -> {
                            existedReleaseEntity.getTender().getAwards()
                                    .stream()
                                    .filter(existed -> existed.getOuterId().equals(award.getOuterId()))
                                    .findFirst()
                                    .ifPresent(existed -> award.setId(existed.getId()));
                        });
            }

            if (!isEmpty(existedReleaseEntity.getTender().getItems())) {
                releaseEntity.getTender().getItems()
                        .forEach(item -> {
                            existedReleaseEntity.getTender().getItems()
                                    .stream()
                                    .filter(existed -> existed.getOuterId().equals(item.getOuterId()))
                                    .findFirst()
                                    .ifPresent(existed -> item.setId(existed.getId()));
                        });
            }
        }

        if (!isEmpty(releaseDTO.getParties())) {
            for (PartyDTO partyDTO : releaseDTO.getParties()) {
                if (!isEmpty(partyDTO.getRoles()) &&
                        (partyDTO.getRoles().contains(BUYER) ||
                                partyDTO.getRoles().contains(SUPPLIER) ||
                                partyDTO.getRoles().contains(TENDERER))
                ) {
                    PartyEntity partyEntity = converter.convert(partyDTO);

                    PartyEntity savedParty = partyDAOService.save(partyEntity);

                    if (partyDTO.getRoles().contains(BUYER)) {
                        releaseEntity.getTender().setBuyerId(savedParty.getId());
                    } else if (partyDTO.getRoles().contains(SUPPLIER)) {
                        releaseEntity.getTender().getSuppliers().add(savedParty);
                    } else {
                        releaseEntity.getTender().getTenderers().add(savedParty);
                    }

                    if (!isEmpty(releaseEntity.getTender().getBids())) {
                        releaseEntity.getTender().getBids()
                                .stream()
                                .filter(bid -> bid.getTendererId().equals(
                                        String.join("-", partyEntity.getIdentifierScheme(), partyEntity.getIdentifierId()))
                                ).forEach(bid -> bid.setBidderId(savedParty.getId()));
                    }
                }
            }
        }

        releaseRepository.save(releaseEntity);
    }
}