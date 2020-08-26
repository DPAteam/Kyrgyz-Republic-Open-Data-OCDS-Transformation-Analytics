SELECT p.id                                           AS id,
       p.lot_id                                       AS related_lot,
       p.amount                                       AS quantity,
       CASE
           WHEN o.external_system = 0
               THEN dlo.product_id
           ELSE oz.original_code
           END                                        AS classification_id,
       CASE
           WHEN o.external_system = 0
               THEN 'DLO'
           ELSE 'OKGZ'
           END                                        AS classification_scheme,
       CASE
           WHEN o.external_system = 0
               THEN dlo.product_name
           ELSE oz.name
           END                                        AS classification_description,
       COALESCE(p.measurement_unit_id, dlo.unit_code) AS unit_id,
       COALESCE(mu.full_name, dlo.unit_name)          AS unit_name,
       p.prce_for_unit                                AS unit_value_amount,
       'KGS'                                          AS unit_value_currency
FROM products p
         LEFT JOIN okgz oz ON oz.code = p.okgz_id
         LEFT JOIN dlo_product dlo ON p.dlo_product_id = dlo.id
         LEFT JOIN measurement_unit mu ON p.measurement_unit_id = mu.id
         JOIN lot l ON p.lot_id = l.id
         JOIN orders o ON l.order_id = o.id
WHERE o.id = ?
;
