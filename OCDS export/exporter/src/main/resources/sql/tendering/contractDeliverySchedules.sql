SELECT ds.date_from          delivery_start_date,
       ds.date_to            delivery_end_date,
       ds.delivery_place     delivery_address,
       ds.delivery_condition delivery_conditions
FROM materialized_contract AS mc
         JOIN orders AS o ON o.id = mc.order_id
         JOIN bid_submission AS bs ON bs.order_id = o.id
         JOIN delivery_schedule AS ds ON ds.bid_submission_id = bs.id
         JOIN materialized_contract_details mcd ON mcd.contract_id = mc.id
         JOIN price_table pt ON pt.id = mcd.price_table_id
WHERE mc.id = :contract_id
UNION ALL
SELECT ds.date_from          delivery_start_date,
       ds.date_to            delivery_end_date,
       ds.delivery_place     delivery_address,
       ds.delivery_condition delivery_conditions
FROM extra_contract AS ec
         JOIN delivery_schedule AS ds ON ds.extra_contract_id = ec.id
WHERE ec."type" = 0
  AND ec.status != 0
  AND ec.id = :contract_id
