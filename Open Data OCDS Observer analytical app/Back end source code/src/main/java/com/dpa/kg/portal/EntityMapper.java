package com.dpa.kg.portal;


import com.dpa.kg.portal.dao.containers.*;
import com.dpa.kg.portal.response.*;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EntityMapper {

    ProcurementMethodAmounts map(ProcurementMethodAmountsDAO dao);

    WeekTender map(WeekTenderDAO dao);

    List<Buyer> map(List<BuyerDAO> dao);

    List<ProcurementMethodAmounts> mapProcurementMethods(List<ProcurementMethodAmountsDAO> dao);

    List<LongDate> mapCountByDates(List<LongByDateDAO> dao);

    List<AmountByDate> mapAmountByDates(List<AmountByDateDAO> dao);

    List<Procurement> convertProcurements(List<ProcurementDAO> dao);

}
