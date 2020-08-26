SELECT pt.lot_id                                                                        AS id,
       pt.sum_contest                                                                   AS initial_amount,
       CASE WHEN pt.auction_price IS NULL THEN pt.sum_contest ELSE pt.auction_price END AS amount,
       coalesce(c.code, 'KGS'::text)                                                    AS currency
FROM bid_submission bs
         JOIN price_table pt ON pt.bid_submission_id = bs.id
         LEFT JOIN currency c ON bs.currency_id = c.ncode
WHERE bs.status NOT IN (0, 2)
  AND bs.id = ?
