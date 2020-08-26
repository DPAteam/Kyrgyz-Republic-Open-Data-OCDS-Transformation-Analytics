SELECT ex.id         AS id,
       ex.date       AS date,
       ex.body       AS description,
       c.inn         AS author_id,
       cn.iso_code   AS country_iso_code,
       ex.answerdate AS date_answered,
       ex.answer     AS answer
FROM orders o
         JOIN explanation ex ON o.id = ex.order_id
         LEFT JOIN person p ON p.id = ex.person_id
         LEFT JOIN company c ON c.id = p.company_id
         JOIN country cn ON c.country_id = cn.id
WHERE o.id = ?
UNION
SELECT ex.id         AS id,
       ex.date       AS date,
       ex.body       AS description,
       c.inn         AS author_id,
       cn.iso_code   AS country_iso_code,
       ex.answerdate AS date_answered,
       ex.answer     AS answer
FROM orders AS o
         JOIN bid_submission AS bs ON o.id = bs.order_id
         JOIN explanation ex ON ex.submission_id = bs.id
         LEFT JOIN person p ON p.id = ex.person_id
         LEFT JOIN company c ON c.id = p.company_id
         JOIN country cn ON c.country_id = cn.id
WHERE o.id = ?