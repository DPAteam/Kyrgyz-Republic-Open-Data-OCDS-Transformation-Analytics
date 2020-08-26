SELECT ds.date_from          AS delivery_start_date,
       ds.date_to            AS delivery_end_date,
       ds.delivery_place     AS delivery_address,
       ds.delivery_condition AS delivery_conditions
FROM extra_contract AS ec
         JOIN delivery_schedule AS ds ON ds.extra_contract_id = ec.id
WHERE ec.type = 1
  AND ec.status != 0
  AND ec.id = ?