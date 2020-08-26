WITH ate_parsed AS (
    WITH RECURSIVE ate_rec(id, code, tree) AS (
        SELECT id,
               code,
               name_ru :: text AS tree
        FROM ate
        WHERE parent IS NULL
        UNION
        SELECT a.id,
               a.code,
               concat(ate_rec.tree, '|', a.name_ru) AS tree
        FROM ate a
                 JOIN ate_rec ON a.parent = ate_rec.id
    )
    SELECT id,
           code,
           nullif(split_part(tree, '|', 1), '') AS country,
           nullif(split_part(tree, '|', 2), '') AS region,
           nullif(split_part(tree, '|', 3), '') AS subregion,
           nullif(split_part(tree, '|', 4), '') AS district,
           nullif(split_part(tree, '|', 5), '') AS subdistrict,
           nullif(split_part(tree, '|', 6), '') AS subsubdistrict,
           nullif(split_part(tree, '|', 7), '') AS locality
    FROM ate_rec)
SELECT c.inn                              AS identifier_id,
       cn.iso_code                        AS country_iso_code,
       c.title_en                         AS name_en,
       c.title_ru                         AS name_ru,
       c.title_ky                         AS name_kg,
       a.code                             AS ate_code,
       a.country                          AS country_name,
       a.region                           AS region,
       a.subregion                        AS subregion,
       a.district                         AS district,
       a.subdistrict                      AS subdistrict,
       a.subsubdistrict                   AS subsubdistrict,
       a.locality                         AS locality,
       c.id                               AS company_id,
       c.fact_address                     AS street_address,
       ARRAY ['buyer', 'procuringEntity'] AS roles
FROM orders o
         JOIN company c ON c.id = o.company_id
         LEFT JOIN ate_parsed a ON a.id = c.ate_id
         LEFT JOIN country cn ON c.country_id = cn.id
WHERE o.id = :order_id

UNION

SELECT c.inn                     AS identifier_id,
       cn.iso_code               AS country_iso_code,
       c.title_en                AS name_en,
       c.title_ru                AS name_ru,
       c.title_ky                AS name_kg,
       a.code                    AS ate_code,
       a.country                 AS country_name,
       a.region                  AS region,
       a.subregion               AS subregion,
       a.district                AS district,
       a.subdistrict             AS subdistrict,
       a.subsubdistrict          AS subsubdistrict,
       a.locality                AS locality,
       c.id                      AS company_id,
       c.fact_address            AS street_address,
       ARRAY ['allowedTenderer'] AS roles
FROM orders o
         JOIN orders_single_source_allowed_companies ssa ON ssa.order_id = o.id
         JOIN company c ON c.id = ssa.company_id
         JOIN ate_parsed a ON c.ate_id = a.id
         JOIN country cn ON c.country_id = cn.id
WHERE o.id = :order_id

UNION

SELECT c.inn              AS identifier_id,
       cn.iso_code        AS country_iso_code,
       c.title_en         AS name_en,
       c.title_ru         AS name_ru,
       c.title_ky         AS name_kg,
       a.code             AS ate_code,
       cn.title_ru        AS country_name,
       a.region           AS region,
       a.subregion        AS subregion,
       a.district         AS district,
       a.subdistrict      AS subdistrict,
       a.subsubdistrict   AS subsubdistrict,
       a.locality         AS locality,
       c.id               AS company_id,
       c.fact_address     AS street_address,
       ARRAY ['tenderer'] AS roles
FROM orders o
         JOIN bid_submission bs ON (bs.order_id = o.id AND bs.status NOT IN (0, 2) AND exists(
        SELECT * FROM order_hronology AS oh WHERE oh.order_id = bs.order_id AND oh."type" = 4)
    AND NOT exists(SELECT * FROM order_hronology AS oh WHERE oh.order_id = bs.order_id AND oh.type = 3))
         JOIN company c ON c.id = bs.company_id
         LEFT JOIN ate_parsed a ON c.ate_id = a.id
         JOIN country cn ON c.country_id = cn.id
WHERE o.id = :order_id

UNION

SELECT DISTINCT c.inn              AS identifier_id,
                cn.iso_code        AS country_iso_code,
                c.title_en         AS name_en,
                c.title_ru         AS name_ru,
                c.title_ky         AS name_kg,
                a.code             AS ate_code,
                cn.title_ru        AS country_name,
                a.region           AS region,
                a.subregion        AS subregion,
                a.district         AS district,
                a.subdistrict      AS subdistrict,
                a.subsubdistrict   AS subsubdistrict,
                a.locality         AS locality,
                c.id               AS company_id,
                c.fact_address     AS street_address,
                ARRAY ['supplier'] AS roles
FROM orders o
         JOIN bid_submission bs ON (bs.order_id = o.id AND bs.status NOT IN (0, 2))
         JOIN company c ON c.id = bs.company_id
         JOIN lot l ON l.order_id = o.id AND l.status <> 3
         LEFT JOIN ate_parsed a ON c.ate_id = a.id
         JOIN country cn ON c.country_id = cn.id
         JOIN evaluation_lot el ON el.lot_id = l.id
         JOIN price_table pt ON pt.evaluation_lot = el.id AND (pt.position IS NOT NULL OR pt.canceled = TRUE)
WHERE o.id = :order_id
  AND pt.position = 1
  AND bs.confirmed = TRUE
  AND (pt.canceled = FALSE OR pt.canceled IS NULL)
UNION

SELECT c.inn                AS identifier_id,
       cn.iso_code          AS country_iso_code,
       c.title_en           AS name_en,
       c.title_ru           AS name_ru,
       c.title_ky           AS name_kg,
       a.code               AS ate_code,
       cn.title_ru          AS country_name,
       a.region             AS region,
       a.subregion          AS subregion,
       a.district           AS district,
       a.subdistrict        AS subdistrict,
       a.subsubdistrict     AS subsubdistrict,
       a.locality           AS locality,
       c.id                 AS company_id,
       c.fact_address       AS street_address,
       ARRAY ['complainer'] AS roles
FROM orders o
         JOIN order_complaint oc
              ON oc.order_id = o.id
         JOIN company c ON c.id = oc.applicant_company_id
         LEFT JOIN ate_parsed a ON c.ate_id = a.id
         JOIN country cn ON c.country_id = cn.id
WHERE o.id = :order_id
UNION
SELECT c.inn              AS identifier_id,
       cn.iso_code        AS country_iso_code,
       c.title_en         AS name_en,
       c.title_ru         AS name_ru,
       c.title_ky         AS name_kg,
       a.code             AS ate_code,
       cn.title_ru        AS country_name,
       a.region           AS region,
       a.subregion        AS subregion,
       a.district         AS district,
       a.subdistrict      AS subdistrict,
       a.subsubdistrict   AS subsubdistrict,
       a.locality         AS locality,
       c.id               AS company_id,
       c.fact_address     AS street_address,
       ARRAY ['enquirer'] AS roles
FROM orders o
         JOIN explanation ex ON o.id = ex.order_id
         LEFT JOIN person p ON p.id = ex.person_id
         LEFT JOIN company c ON c.id = p.company_id
         LEFT JOIN ate_parsed a ON c.ate_id = a.id
         JOIN country cn ON c.country_id = cn.id
WHERE o.id = :order_id
UNION
SELECT c.inn              AS identifier_id,
       cn.iso_code        AS country_iso_code,
       c.title_en         AS name_en,
       c.title_ru         AS name_ru,
       c.title_ky         AS name_kg,
       a.code             AS ate_code,
       cn.title_ru        AS country_name,
       a.region           AS region,
       a.subregion        AS subregion,
       a.district         AS district,
       a.subdistrict      AS subdistrict,
       a.subsubdistrict   AS subsubdistrict,
       a.locality         AS locality,
       c.id               AS company_id,
       c.fact_address     AS street_address,
       ARRAY ['enquirer'] AS roles
FROM orders o
         JOIN bid_submission AS bs ON o.id = bs.order_id
         JOIN explanation ex ON ex.submission_id = bs.id
         LEFT JOIN person p ON p.id = ex.person_id
         LEFT JOIN company c ON c.id = p.company_id
         LEFT JOIN ate_parsed a ON c.ate_id = a.id
         JOIN country cn ON c.country_id = cn.id
WHERE o.id = :order_id;
