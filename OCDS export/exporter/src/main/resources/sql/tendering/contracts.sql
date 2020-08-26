SELECT DISTINCT bs.id                 AS id,
                bs.contract_number    AS contract_number,
                ''                    AS type,
                bs.date_of_contract   AS date_signed,
                sum(pt.auction_price) AS amount_discounted,
                sum(pt.sum_contest)   AS amount,
                'KGS'                 AS currency
FROM orders AS o
         JOIN bid_submission AS bs ON bs.order_id = o.id
         JOIN bid_submission_lot AS bsl ON bsl.bid_submission_id = bs.id
         JOIN lot AS l ON bsl.lot_id = l.id AND l.id = bsl.lot_id
         LEFT JOIN price_table AS pt ON pt.bid_submission_id = bs.id AND pt.lot_id = l.id
         LEFT JOIN evaluation_lot AS el ON el.lot_id = l.id
    AND pt.evaluation_lot = el.id
WHERE o.status = 7
  AND bs.confirmed = 't'
  AND bs.confirmed_qualification <> 't'
  AND bs.contract_number NOTNULL
  AND bs.date_of_contract NOTNULL
  AND pt."position" = 1
  AND pt.canceled = 'f'
  AND (l.status <> 3)
  AND (el.canceled = 'f')
  AND o.id = :order_id
GROUP BY bs.id,
         bs.contract_number,
         bs.date_of_contract
