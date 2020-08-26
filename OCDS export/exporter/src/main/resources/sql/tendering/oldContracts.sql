SELECT mc.id                 AS id,
       mc.contract_number    AS contract_number,
       '-former'             AS type,
       mc.date_of_contract   AS date_signed,
       sum(pt.auction_price) AS amount_discounted,
       sum(pt.sum_contest)   AS amount,
       'KGS'                 AS currency
FROM materialized_contract AS mc
         JOIN orders AS o ON o.id = mc.order_id
         JOIN materialized_contract_details mcd ON mcd.contract_id = mc.id
         JOIN price_table pt ON pt.id = mcd.price_table_id
WHERE mc.order_id = :order_id
GROUP BY mc.id

UNION

SELECT ec.id                           AS id,
       ec.number                       AS contract_number,
       '-centralized'                  AS type,
       ec.contract_date                AS date_signed,
       sum(p.amount * p.prce_for_unit) AS amount_discounted,
       sum(p.amount * p.prce_for_unit) AS amount,
       'KGS'                           AS currency
FROM extra_contract AS ec
         JOIN price_of_the_product potp ON potp.extra_contract_id = ec.id
         JOIN products p ON potp.product_id = p.id
         JOIN lot l ON l.id = ec.lot_id
         JOIN orders o ON l.order_id = o.id
WHERE ec.type = 0
  AND ec.status != 0
  AND o.id = :order_id
GROUP BY ec.id
