SELECT bs.id           AS id,
       CASE
           WHEN bs.confirmed_qualification = FALSE THEN 'valid'::text
           WHEN bs.confirmed_qualification = TRUE THEN 'disqualified'::text
           WHEN bs.confirmed_qualification IS NULL THEN 'pending'::text
           END         AS status,
       bs.date_created AS date,
       cn.iso_code     AS country_iso_code,
       c.inn           AS tenderer_id
FROM bid_submission bs
         JOIN company c ON c.id = bs.company_id
         LEFT JOIN country cn ON c.country_id = cn.id
WHERE bs.status NOT IN (0, 2)
  AND exists(SELECT * FROM order_hronology AS oh WHERE oh.order_id = bs.order_id AND oh."type" = 4)
  AND NOT exists(SELECT * FROM order_hronology AS oh WHERE oh.order_id = bs.order_id AND oh.type = 3)
  AND bs.order_id = ?
