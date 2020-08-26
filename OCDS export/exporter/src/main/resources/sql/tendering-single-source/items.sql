SELECT p.id                                           AS id,
       p.id                                           AS related_lot,
       p.amount                                       AS quantity,
       CASE
           WHEN p.dlo_product_id IS NOT NULL
               THEN dlo.product_id
           ELSE oz.original_code
           END                                        AS classification_id,
       CASE
           WHEN p.dlo_product_id IS NOT NULL
               THEN 'DLO'
           ELSE 'OKGZ'
           END                                        AS classification_scheme,
       CASE
           WHEN p.dlo_product_id IS NOT NULL
               THEN dlo.product_name
           ELSE oz.name
           END                                        AS classification_description,
       COALESCE(p.measurement_unit_id, dlo.unit_code) AS unit_id,
       COALESCE(m.full_name, dlo.unit_name)           AS unit_name,
       p.prce_for_unit                                AS unit_value_amount,
       'KGS'                                          AS unit_value_currency
FROM extra_contract ec
         JOIN price_of_the_product potp ON potp.extra_contract_id = ec.id
         JOIN products p ON potp.product_id = p.id
         LEFT JOIN okgz oz ON oz.code = p.okgz_id
         LEFT JOIN dlo_product dlo ON p.dlo_product_id = dlo.id
         LEFT JOIN measurement_unit m ON p.measurement_unit_id = m.id
WHERE ec.id = ?
