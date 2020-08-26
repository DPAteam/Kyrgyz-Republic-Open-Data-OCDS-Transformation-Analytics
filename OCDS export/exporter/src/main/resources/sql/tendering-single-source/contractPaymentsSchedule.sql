SELECT dp.date_from AS payment_date,
       dp.date_to   AS payment_due_date,
       dp.type      AS payment_type,
       dp.doc       AS payment_condition
FROM extra_contract AS ec
         JOIN delivery_payment AS dp ON dp.extra_contract_id = ec.id
WHERE ec.type = 1
  AND ec.status != 0
  AND ec.id = ?