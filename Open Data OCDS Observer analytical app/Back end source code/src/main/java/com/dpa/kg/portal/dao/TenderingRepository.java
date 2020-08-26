package com.dpa.kg.portal.dao;


import com.dpa.kg.portal.dao.containers.*;
import com.dpa.kg.portal.response.DoubleDate;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface TenderingRepository extends CrudRepository<TenderingRelease, String> {

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$unwind: '$parties'}",
            "{$match: {'parties.roles': {$in: ['buyer']}}}",
            "{$unwind: '$tender.lots'}",
            "{\n" +
                    "        $group: {\n" +
                    "            _id: '$parties.id',\n" +
                    "            name: {$first: '$parties.identifier.legalName'},\n" +
                    "            lotsAmount: {$sum: '$tender.lots.value.amount'}\n" +
                    "        }\n" +
                    "    }",
            "{$sort: {lotsAmount: -1}}",
            "{$limit: 10}"
    })
    List<BuyerDAO> getTop10Buyers(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$unwind: {path: '$awards', 'preserveNullAndEmptyArrays': true}}",
            "{$addFields: {awardDate: {$dateToString: {format: '%Y-%m-%d', date: '$awards.date'}}}}",
            "{$match: {'awardDate': {$in: [$?0]}}}",
            "{$addFields: {competitive: {$ne: ['$tender.procurementMethod', 'direct']}}}",
            "{$unwind: '$tender.lots'}",
            "{\n" +
                    "        $group: {\n" +
                    "            _id: null,\n" +
                    "            'competitiveLotsAmount': {\n" +
                    "                $sum: {\n" +
                    "                    $cond: {if: {$eq: ['$competitive', true]}, then: '$tender.lots.value.amount', else: 0}\n" +
                    "                }\n" +
                    "            },\n" +
                    "            'notCompetitiveLotsAmount': {\n" +
                    "                $sum: {\n" +
                    "                    $cond: {if: {$eq: ['$competitive', false]}, then: '$tender.lots.value.amount', else: 0}\n" +
                    "                }\n" +
                    "            }\n" +
                    "        }\n" +
                    "    }",
    })
    ProcurementMethodAmountsDAO getProcurementMethodAmounts(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$addFields: {competitive: {$ne: ['$tender.procurementMethod', 'direct']}}}",
            "{$unwind: '$tender.lots'}",
            "{\n" +
                    "        $group: {\n" +
                    "            _id: '$publishedDate',\n" +
                    "            'date' : { $first : '$publishedDate'},\n" +
                    "            'competitiveLotsAmount': {\n" +
                    "                $sum: {\n" +
                    "                    $cond: {if: {$eq: ['$competitive', true]}, then: '$tender.lots.value.amount', else: 0}\n" +
                    "                }\n" +
                    "            },\n" +
                    "            'notCompetitiveLotsAmount': {\n" +
                    "                $sum: {\n" +
                    "                    $cond: {if: {$eq: ['$competitive', false]}, then: '$tender.lots.value.amount', else: 0}\n" +
                    "                }\n" +
                    "            }\n" +
                    "        }\n" +
                    "    }",
            "{ $sort : { date : 1 } }"
    })
    List<ProcurementMethodAmountsDAO> getCompetition(List<String> activeDays);


    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$unwind: '$parties'}",
            "{$match: {'parties.roles': {$in: ['buyer']}}}",
            "{$group: {_id: null, value: {$sum: 1}}}"
    })
    LongValueDAO getBuyersCount(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$unwind: '$parties'}",
            "{$match: {'parties.roles': {$in: ['supplier']}}}",
            "{$group: {_id: null, value: {$sum: 1}}}"
    })
    LongValueDAO getSuppliersCount(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
//            "{$unwind : '$awards'}",
            "{$unwind : '$tender.lots'}",
            "{ $match : {" +
                    "'tender.lots.status': 'complete'" +
//                    "'$expr': {'$eq': ['$awards.relatedLot', '$tender.lots.id']}" +
                    "}}",
            "{ $count : 'value'}"
    })
    Optional<LongValueDAO> getCompletedLotsCount(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{ $match : { 'tender.lots' : { $exists : true } } }",
            "{$group: {_id: null, value: {$avg: {$size: '$tender.lots'}}}}"
    })
    Optional<LongValueDAO> getAvgLotsCount(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{ $match : { 'tender.lots' : { $exists : true } } }",
            "{$group: {_id: '$publishedDate', value: {$avg: { $size : '$tender.lots' }}}}",
            "{ $project : { date : '$_id', value : 1}},",
            "{$sort: {'_id': -1}}",
            "{$limit: 7}"
    })
    List<LongByDateDAO> getAvgLotsCountByDate(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$unwind : '$tender.items'}",
            "{$addFields  : { cpv : '$tender.items.classification.id' }}",
            "{$group : { _id : '$tender.id', cpvs : { $addToSet : '$cpv' }}}",
            "{$group : { _id : null, value : {$avg : { $size : '$cpvs' }}}}"
    })
    Optional<LongValueDAO> getAvgCpvCount(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$unwind : '$tender.items'}",
            "{$addFields  : { cpv : '$tender.items.classification.id' }}",
            "{$group : { _id : '$tender.id', date : { $first : '$publishedDate' } ,cpvs : { $addToSet : '$cpv' }}}",
            "{$group : { _id : '$date', value : {$avg : { $size : '$cpvs' }}}}",
            "{ $project : { date : '$_id', value : 1 }}",
            "{ $sort : { date : -1 }}",
            "{ $limit : 7}"
    })
    List<DoubleDate> getAvgCpvCountByDate(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$match: {'tender.procurementMethod': {$ne: 'direct'}}}",
            "{$unwind: '$tender.lots'}",
            "{$group : {_id : null, value : {$sum : '$tender.lots.value.amount'} }}"
    })
    Optional<DoubleValueDAO> getPublishedLotsAmount(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$match: {'tender.procurementMethod': {$ne: 'direct'}}}",
            "{ $unwind : '$tender.lots'}",
            "{$group: {_id: '$publishedDate', value: {$sum: '$tender.lots.value.amount'}}}",
            "{ $project: { date : '$_id', value : 1}}",
            "{$sort: {'date': -1}}",
            "{$limit: 7}"
    })
    List<AmountByDateDAO> getPublishedLotsAmountPerDay(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$match: {'tender.procurementMethod': {$ne: 'direct'}}}",
            "{$group: {_id: null, value: { $sum: {$size: '$tender.lots'}}}}"
    })
    Optional<LongValueDAO> getPublishedLotsCount(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$match: {'tender.procurementMethod': {$ne: 'direct'}}}",
            "{$group: {_id: '$publishedDate', value: {$sum: {$size: '$tender.lots'}}}}",
            "{ $project : { date : '$_id', value : 1 }}",
            "{$sort: {date: 1}}",
            "{$limit: 7}"
    })
    List<LongByDateDAO> getPublishedLotsCountByDate(List<String> activeDays);

    @Aggregation({
            "{$addFields: {publishedDate: {$dateToString: {format: '%Y-%m-%d', date: '$tender.datePublished'}}}}",
            "{$match: {'publishedDate': {$in: [$?0]}}}",
            "{$unwind: '$tender.lots'}",
            "{$unwind: '$parties'}",
            "{$match: {'parties.roles': {$in: ['buyer']}}}",
            "{\n" +
                    "        $group: {\n" +
                    "            _id: '$tender.id',\n" +
                    "            amount : { $sum : '$tender.lots.value.amount' },\n" +
                    "            title : { $first : '$tender.title' },\n" +
                    "            number : { $first : '$tender.tenderNumber' },\n" +
                    "            procurementMethod : { $first : '$tender.procurementMethod' },\n" +
                    "            buyer : { $first : '$parties.identifier.legalName' }\n" +
                    "        }\n" +
                    "    }",
            "{ $sort : { amount : -1}}",
            "{ $limit : 1}"
    })
    WeekTenderDAO getTenderOfWeek(List<String> activeDays);

    @Aggregation({
            "{$match: {'tender.procurementMethod': 'direct'}}",
            "{$unwind: '$tender.items'}",
            "{\n" +
                    "        $addFields: {\n" +
                    "            buyer: {\n" +
                    "                $filter: {\n" +
                    "                    input: \"$parties\",\n" +
                    "                    as: \"party\",\n" +
                    "                    cond: {$in: ['buyer', '$$party.roles']}\n" +
                    "                }\n" +
                    "            },\n" +
                    "            supplier: {\n" +
                    "                $filter: {\n" +
                    "                    input: \"$parties\",\n" +
                    "                    as: \"party\",\n" +
                    "                    cond: {$in: ['supplier', '$$party.roles']}\n" +
                    "                }\n" +
                    "            },\n" +
                    "        }\n" +
                    "    }",
            "{$unwind: '$buyer'}",
            "{$unwind: '$supplier'}",
            "{$unwind: '$contracts'}",
            "{\n" +
                    "        $group: {\n" +
                    "            _id: {\n" +
                    "                buyer: '$buyer.identifier.id',\n" +
                    "                supplier: '$supplier.identifier.id',\n" +
                    "                cpv: '$tender.items.classification.id'\n" +
                    "            },\n" +
                    "            buyer: {$first: '$buyer.identifier.legalName'},\n" +
                    "            supplier: {$first: '$supplier.identifier.legalName'},\n" +
                    "            cpv: {$first: '$tender.items.classification.description'},\n" +
                    "            itemsAmount: {$sum: {$multiply: ['$tender.items.unit.value.amount', '$tender.items.quantity']}}," +
                    "           contractNumber : { $first : '$contracts.contractNumber'}" +
                    "        }\n" +
                    "    }",
            "{$sort: {itemsAmount: -1}}",
            "{$limit: 10}"
    })
    List<ProcurementDAO> getTop10Procurements(List<String> activeDays);

}
