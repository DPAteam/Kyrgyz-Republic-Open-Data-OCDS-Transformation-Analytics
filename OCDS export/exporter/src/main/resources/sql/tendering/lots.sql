SELECT l.id                                                          AS id,
       CASE
           WHEN o.status IN (3, 4, 8, 9, 6, 10, 11, 12, 13, 15) AND l.status IN (0, 1, 2) AND
                (table1.el_id IS NULL OR table1.canceled IS FALSE) THEN 'active'
           WHEN o.status IN (3, 4, 8, 9, 6, 10, 11, 12, 13, 15) AND l.status IN (0, 1, 2) AND table1.canceled IS TRUE
               THEN 'cancelled'
           WHEN o.status IN (3, 4, 8, 9, 6, 10, 11, 12, 13, 7, 15) AND l.status = 3 THEN 'cancelled'
           WHEN o.status = 5 THEN 'cancelled'
           WHEN o.status = 7 AND l.status IN (0, 1, 2) AND table1.canceled IS FALSE THEN 'complete'
           WHEN o.status = 7 AND l.status IN (0, 1, 2) AND (table1.canceled IS TRUE OR table1.el_id IS NULL)
               THEN 'unsuccessful'
           WHEN o.status = 14 THEN 'unsuccessful'
           END                                                       AS status,
       CASE WHEN l.sum_contest IS NULL THEN 0 ELSE l.sum_contest END AS amount,
       'KGS'                                                         AS currency,
       l."number"                                                    AS lot_number,
       l.procurement_planning_id                                     AS related_plan_id,
       l.delivery_details                                            AS delivery_address,
       l.delivery_period                                             AS delivery_date_details,
       l.name                                                        AS title,
       CASE
           WHEN l.incoterms = 0 THEN 'EXW'::text
           WHEN l.incoterms = 1 THEN 'FCA'::text
           WHEN l.incoterms = 2 THEN 'FAS'::text
           WHEN l.incoterms = 3 THEN 'FOB'::text
           WHEN l.incoterms = 4 THEN 'CFR'::text
           WHEN l.incoterms = 5 THEN 'CIF'::text
           WHEN l.incoterms = 6 THEN 'CIP'::text
           WHEN l.incoterms = 7 THEN 'CPT'::text
           WHEN l.incoterms = 8 THEN 'DAT'::text
           WHEN l.incoterms = 9 THEN 'DAP'::text
           WHEN l.incoterms = 10 THEN 'DDP'::text
           END                                                       AS delivery_terms
FROM lot l
         JOIN orders o ON o.id = l.order_id
         LEFT JOIN (SELECT *
                    FROM (SELECT el.id                                                           AS el_id,
                                 el.canceled,
                                 el.lot_id                                                       AS lot_id,
                                 e.id                                                            AS e_id,
                                 e.date                                                          AS max_date,
                                 row_number()
                                 OVER (PARTITION BY el.lot_id ORDER BY el.lot_id, e."date" DESC) AS row_number
                          FROM evaluation_lot AS el
                                   JOIN evaluation e ON e.id = el.evaluation_id) AS a
                    WHERE row_number = 1) table1
                   ON table1.lot_id = l.id
WHERE o.id = ?
