SELECT pt.id                                                                            AS id,
       CASE
           WHEN (pt."position" = 1 AND bs.confirmed = TRUE AND pt.canceled = TRUE) THEN 'disqualified'
           WHEN (pt."position" = 1 AND bs.confirmed = TRUE AND pt.canceled = FALSE) THEN 'active'
           WHEN (pt."position" = 1 AND bs.confirmed = TRUE AND pt.canceled IS NULL) THEN 'active'
           WHEN (pt."position" = 1 AND bs.confirmed = FALSE AND pt.canceled = TRUE) THEN 'rejected'
           WHEN (pt."position" = 1 AND bs.confirmed = FALSE AND pt.canceled = FALSE) THEN 'rejected'
           WHEN (pt."position" = 1 AND bs.confirmed = FALSE AND pt.canceled IS NULL) THEN 'rejected'
           WHEN (pt."position" = 1 AND bs.confirmed IS NULL AND pt.canceled = TRUE) THEN 'disqualified'
           WHEN (pt."position" = 1 AND bs.confirmed IS NULL AND pt.canceled = FALSE) THEN 'pending'
           WHEN (pt."position" = 1 AND bs.confirmed IS NULL AND pt.canceled IS NULL) THEN 'pending'
           WHEN (pt."position" > 1 AND bs.confirmed = TRUE AND pt.canceled = TRUE) THEN 'disqualified'
           WHEN (pt."position" > 1 AND bs.confirmed = TRUE AND pt.canceled = FALSE) THEN 'pending'
           WHEN (pt."position" > 1 AND bs.confirmed = TRUE AND pt.canceled IS NULL) THEN 'pending'
           WHEN (pt."position" > 1 AND bs.confirmed = FALSE AND pt.canceled = TRUE) THEN 'rejected'
           WHEN (pt."position" > 1 AND bs.confirmed = FALSE AND pt.canceled = FALSE) THEN 'rejected'
           WHEN (pt."position" > 1 AND bs.confirmed = FALSE AND pt.canceled IS NULL) THEN 'rejected'
           WHEN (pt."position" > 1 AND bs.confirmed IS NULL AND pt.canceled = TRUE) THEN 'disqualified'
           WHEN (pt."position" > 1 AND bs.confirmed IS NULL AND pt.canceled = FALSE) THEN 'pending'
           WHEN (pt."position" > 1 AND bs.confirmed IS NULL AND pt.canceled IS NULL) THEN 'pending'
           WHEN (pt."position" IS NULL AND bs.confirmed = TRUE AND pt.canceled = TRUE) THEN 'disqualified'
           WHEN (pt."position" IS NULL AND bs.confirmed = TRUE AND pt.canceled = FALSE) THEN 'pending'
           WHEN (pt."position" IS NULL AND bs.confirmed = TRUE AND pt.canceled IS NULL) THEN 'pending'
           WHEN (pt."position" IS NULL AND bs.confirmed = FALSE AND pt.canceled = TRUE) THEN 'rejected'
           WHEN (pt."position" IS NULL AND bs.confirmed = FALSE AND pt.canceled = FALSE) THEN 'rejected'
           WHEN (pt."position" IS NULL AND bs.confirmed = FALSE AND pt.canceled IS NULL) THEN 'rejected'
           WHEN (pt."position" IS NULL AND bs.confirmed IS NULL AND pt.canceled = TRUE) THEN 'disqualified'
           WHEN (pt."position" IS NULL AND bs.confirmed IS NULL AND pt.canceled = FALSE) THEN 'pending'
           WHEN (pt."position" IS NULL AND bs.confirmed IS NULL AND pt.canceled IS NULL) THEN 'pending'
           END                                                                          AS status,
       pt.lot_id                                                                        AS related_lot,
       CASE WHEN pt.auction_price IS NULL THEN pt.sum_contest ELSE pt.auction_price END AS value_amount,
       'KGS'                                                                            AS value_currency,
       COALESCE((SELECT bs2.id
                 FROM bid_submission bs2
                 WHERE bs2.company_id = bs.company_id
                   AND o.id = bs2.order_id
                   AND bs2.status NOT IN (0, 2)), bs.id)                                AS related_bid,
       t.award_date                                                                     AS date
FROM (
         SELECT order_id, MAX(n.date_created) AS award_date
         FROM notification AS n
         WHERE n.title IN ('Вы успешно подтвердили желание подписать договор', 'Вы отказались подписывать договор')
         GROUP BY order_id
         UNION
         SELECT o.id AS order_id, MAX(o.date_updated) AS award_date
         FROM orders o
                  LEFT JOIN notification n ON n.order_id = o.id AND n.title IN
                                                                    ('Вы успешно подтвердили желание подписать договор',
                                                                     'Вы отказались подписывать договор')
         WHERE n.id IS NULL
         GROUP BY o.id
     ) t
         JOIN orders o ON o.id = t.order_id
         JOIN lot l ON o.id = l.order_id AND l.status != 3
         JOIN evaluation_lot el ON el.lot_id = l.id AND el.canceled IS NOT TRUE
         JOIN price_table pt ON pt.evaluation_lot = el.id
         JOIN bid_submission bs ON bs.id = pt.bid_submission_id AND bs.confirmed_qualification = FALSE
         LEFT JOIN currency c ON bs.currency_id = c.ncode
WHERE o.status NOT IN (0, 1, 2, 5)
  AND o.id = ?
