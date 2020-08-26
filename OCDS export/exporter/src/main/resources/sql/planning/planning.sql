SELECT pph.id                                             AS id,
       pph.year                                           AS budget_year,
       pph.date_created                                   AS date_created,
       pph.date_last_changed                              AS date_changed,
       pph.planning_status                                AS status,
       pph.planning_type                                  AS type,
       (SELECT sum(pp.amount)
        FROM procurement_planning pp
        WHERE pp.procurement_planning_header_id = pph.id) AS amount,
       'KGS'::text                                        AS currency,
       concat('KG-INN-', c.inn)                           AS buyer_id,
       c.title_ru                                         AS buyer_name
FROM procurement_planning_header pph
         JOIN company c ON pph.company_id = c.id
WHERE pph.id = ?