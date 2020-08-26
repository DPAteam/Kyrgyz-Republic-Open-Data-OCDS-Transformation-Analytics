SELECT concat('ocds-h7i0z4-', o.id, '-ocds-h7i0z4-', o1.id) AS id,
       'prior'                                             AS relationship,
       'ocid'                                              AS scheme,
       o1.id                                               AS identifier,
       o1."number"                                         AS tender_number
FROM orders o
         JOIN orders o1 ON o.previous_number = o1."number"
WHERE o.format != 2
  AND o.id = :order_id
UNION
SELECT concat('ocds-h7i0z4-', o.id, '-ocds-h7i0z4-', CASE
                                                         WHEN o.previous_signed_order_number IS NOT NULL
                                                             THEN (SELECT id
                                                                   FROM orders
                                                                   WHERE number = o.previous_signed_order_number
                                                                   LIMIT 1)
    END)       AS id,
       'prior' AS relationship,
       'ocid'  AS scheme,
       CASE
           WHEN o.previous_signed_order_number IS NOT NULL
               THEN (SELECT id FROM orders WHERE number = o.previous_signed_order_number LIMIT 1)
           END AS identifier,
       CASE
           WHEN o.previous_signed_order_number IS NOT NULL
               THEN (SELECT number FROM orders WHERE number = o.previous_signed_order_number LIMIT 1)
           END AS tender_number
FROM orders o
WHERE length(o.previous_signed_order_number) > 5
  AND o.id = :order_id
UNION
SELECT concat('ocds-h7i0z4-', o.id, '-ocds-h7i0z4-', ns.previous_not_signed_order_id) AS id,
       'unsuccessfulProcess'                                                          AS relationship,
       'ocid'                                                                         AS scheme,
       ns.previous_not_signed_order_id                                                AS related_process_identifier,
       (SELECT number FROM orders o WHERE ns.previous_not_signed_order_id = o.id)     AS tender_number
FROM orders o
         JOIN orders_previous_not_signed_orders ns ON ns.order_id = o.id
WHERE o.id = :order_id
