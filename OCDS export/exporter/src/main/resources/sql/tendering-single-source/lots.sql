SELECT p.id                       AS id,
       'complete'                 AS status,
       p.amount * p.prce_for_unit AS amount,
       'KGS'                      AS currency
FROM extra_contract ec
         JOIN price_of_the_product potp ON potp.extra_contract_id = ec.id
         JOIN products p ON potp.product_id = p.id
WHERE ec.id = ?