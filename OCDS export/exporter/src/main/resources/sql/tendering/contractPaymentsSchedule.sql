SELECT dp.date_from AS payment_date,
       dp.date_to   AS payment_due_date,
       dp.type      AS payment_type,
       dp.doc       AS payment_condition
FROM materialized_contract mc
         JOIN orders o ON o.id = mc.order_id
         JOIN bid_submission bs ON bs.order_id = o.id
         JOIN delivery_payment dp ON dp.bid_submission_id = bs.id
         JOIN materialized_contract_details mcd ON mcd.contract_id = mc.id
         JOIN price_table pt ON pt.id = mcd.price_table_id
WHERE mc.id = :contract_id
UNION ALL
SELECT dp.date_from AS payment_date,
       dp.date_to   AS payment_due_date,
       dp.type      AS payment_type,
       dp.doc       AS payment_condition
FROM extra_contract AS ec
         JOIN delivery_payment AS dp ON dp.extra_contract_id = ec.id
WHERE ec.type = 0
  AND ec.status != 0
  AND ec.id = :contract_id
