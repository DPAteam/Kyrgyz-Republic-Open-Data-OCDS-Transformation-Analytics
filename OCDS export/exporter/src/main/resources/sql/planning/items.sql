SELECT ppd.id,
       'okgz'                 classification_scheme,
       okgz.original_code     classification_id,
       okgz.name              classification_description,
       ppd.amount             quantity,
       mu.id                  unit_id,
       mu.full_name           unit_name,
       ppd.price_for_one_unit unit_amount,
       'KGS'::text            unit_currency
FROM procurement_planning_detail ppd
         JOIN okgz ON ppd.okgz_id = okgz.code
         JOIN measurement_unit mu ON ppd.measurement_unit_id = mu.id
WHERE ppd.procurement_planning_id = ?
UNION
SELECT ppd.id,
       'dlo'                  classification_scheme,
       dp.product_id          classification_id,
       dp.product_name        classification_description,
       ppd.amount             quantity,
       dp.unit_code           unit_id,
       dp.unit_name           unit_name,
       ppd.price_for_one_unit unit_amount,
       'KGS'::text            unit_currency
FROM procurement_planning_detail ppd
         JOIN dlo_product dp ON ppd.dlo_product_id = dp.id
WHERE ppd.procurement_planning_id = ?