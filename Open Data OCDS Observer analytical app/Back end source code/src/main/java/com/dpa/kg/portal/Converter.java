package com.dpa.kg.portal;

import com.dpa.kg.portal.dao.containers.*;
import com.dpa.kg.portal.response.*;

import java.util.List;

public interface Converter {

    Long convert(LongValueDAO dao);

    Double convert(DoubleValueDAO dao);

    List<Buyer> convertBuyers(List<BuyerDAO> dao);

    List<ProcurementMethodAmounts> convertProcurementMethods(List<ProcurementMethodAmountsDAO> dao);

    List<LongDate> convertCountByDays(List<LongByDateDAO> dao);

    List<AmountByDate> convertDateAmounts(List<AmountByDateDAO> dao);

    ProcurementMethodAmounts convert(ProcurementMethodAmountsDAO dao);

    WeekTender convert(WeekTenderDAO dao);

    List<Procurement> convertProcurements(List<ProcurementDAO> dao);

    BuyersActivity convert(List<BuyerActivityDAO> dao);
}
