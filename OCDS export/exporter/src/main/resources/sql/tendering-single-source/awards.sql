SELECT potp.id                     AS id,
       'active'                    AS status,
       p.id                        AS related_lot,
       ec.contract_date::timestamp AS date,
       p.amount * p.prce_for_unit  AS value_amount,
       'KGS'                       AS value_currency
FROM extra_contract ec
         JOIN price_of_the_product potp ON potp.extra_contract_id = ec.id
         JOIN products p ON p.id = potp.product_id
WHERE ec.type = 1
  AND ec.status != 0
  AND ec.id = ?
