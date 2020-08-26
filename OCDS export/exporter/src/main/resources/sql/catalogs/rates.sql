SELECT r.date,
       r.rate_per_som AS rate,
       c.code,
       c.name_ru      AS name
FROM currency_rate r
         JOIN currency c ON r.currency_ncode = c.ncode
