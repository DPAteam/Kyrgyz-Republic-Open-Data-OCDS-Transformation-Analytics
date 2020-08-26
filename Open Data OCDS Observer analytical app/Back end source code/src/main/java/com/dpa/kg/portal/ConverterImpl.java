package com.dpa.kg.portal;

import com.dpa.kg.portal.dao.containers.*;
import com.dpa.kg.portal.response.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Component
@AllArgsConstructor
public class ConverterImpl implements Converter {

    private EntityMapper mapper;

    @Override
    public Long convert(LongValueDAO dao) {
        return dao == null ? null : dao.getValue();
    }

    @Override
    public Double convert(DoubleValueDAO dao) {
        return dao == null ? null : dao.getValue();
    }

    @Override
    public List<Buyer> convertBuyers(List<BuyerDAO> dao) {
        return mapper.map(dao);
    }

    @Override
    public List<ProcurementMethodAmounts> convertProcurementMethods(List<ProcurementMethodAmountsDAO> dao) {
        return mapper.mapProcurementMethods(dao);
    }

    @Override
    public List<LongDate> convertCountByDays(List<LongByDateDAO> dao) {
        return mapper.mapCountByDates(dao);
    }

    @Override
    public List<AmountByDate> convertDateAmounts(List<AmountByDateDAO> dao) {
        return mapper.mapAmountByDates(dao);
    }

    @Override
    public ProcurementMethodAmounts convert(ProcurementMethodAmountsDAO dao) {
        return mapper.map(dao);
    }

    @Override
    public WeekTender convert(WeekTenderDAO dao) {
        return mapper.map(dao);
    }

    @Override
    public List<Procurement> convertProcurements(List<ProcurementDAO> dao) {
        return mapper.convertProcurements(dao);
    }

    @Override
    public BuyersActivity convert(List<BuyerActivityDAO> dao) {
        BuyersActivity dto = new BuyersActivity();

        List<LongDate> buyersCount = dao.stream().map(value ->
                new LongDate(value.getDate(), value.getBuyersCount())
        ).collect(toList());

        List<LongDate> avgBuyerLotsAmount = dao.stream().map(value ->
                new LongDate(value.getDate(), value.getLotsAmount() / value.getBuyersCount())
        ).collect(toList());


        List<LongDate> avgBuyerLotsCount = dao.stream().map(value ->
                new LongDate(value.getDate(), value.getLotsCount() / value.getBuyersCount())
        ).collect(toList());

        dto.setBuyersCount(buyersCount);
        dto.setAvgBuyerLotsAmount(avgBuyerLotsAmount);
        dto.setAvgBuyerLotsCount(avgBuyerLotsCount);
        return dto;
    }
}
