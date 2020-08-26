SELECT pp.id                         AS id,
       pt.lot_id                     AS related_lot,
       pp.product_id                 AS related_item,
       pp.price_of_unit              AS unit_value_amount,
       coalesce(c.code, 'KGS'::text) AS unit_value_currency
FROM bid_submission bs
         JOIN price_table pt ON pt.bid_submission_id = bs.id
         JOIN price_of_the_product pp ON pp.price_table_id = pt.id
         LEFT JOIN currency c ON bs.currency_id = c.ncode
WHERE bs.status NOT IN (0, 2)
  AND bs.id = ?