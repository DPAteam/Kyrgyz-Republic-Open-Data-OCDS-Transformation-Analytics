package com.datapath.kg.loader.utils;

import com.datapath.kg.loader.dao.entity.PartyEntity;
import com.datapath.kg.loader.dao.entity.ReleaseEntity;
import com.datapath.kg.loader.dto.PartyDTO;
import com.datapath.kg.loader.dto.ReleaseDTO;

public interface Converter {

    PartyEntity convert(PartyDTO partyDTO);

    ReleaseEntity convert(ReleaseDTO releaseDTO);
}
