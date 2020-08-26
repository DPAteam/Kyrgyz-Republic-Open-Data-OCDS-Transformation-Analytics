SELECT ec.id                           AS id,
       ec.number                       AS contract_number,
       ec.contract_date                AS date_signed,
       sum(p.amount * p.prce_for_unit) AS amount_discounted,
       sum(p.amount * p.prce_for_unit) AS amount,
       'KGS'                           AS currency
FROM extra_contract AS ec
         JOIN price_of_the_product potp ON potp.extra_contract_id = ec.id
         JOIN products p ON potp.product_id = p.id
WHERE ec."type" = 1
  AND ec.status != 0
  AND ec.id = ?
GROUP BY ec.id