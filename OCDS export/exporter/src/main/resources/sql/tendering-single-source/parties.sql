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
SELECT c.inn            AS identifier_id,
       cn.iso_code      AS country_iso_code,
       c.title_en       AS name_en,
       c.title_ru       AS name_ru,
       c.title_ky       AS name_kg,
       a.code           AS ate_code,
       a.country        AS country_name,
       a.region         AS region,
       a.subregion      AS subregion,
       a.district       AS district,
       a.subdistrict    AS subdistrict,
       a.subsubdistrict AS subsubdistrict,
       a.locality       AS locality,
       c.id             AS company_id,
       c.fact_address   AS street_address,
       ARRAY ['buyer']  AS roles
FROM extra_contract AS ec
         JOIN company c ON c.id = ec.company_id
         JOIN ate_parsed a ON a.id = c.ate_id
         JOIN country cn ON c.country_id = cn.id
WHERE ec.id = :order_id

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
                c.id             AS company_id,
                c.fact_address     AS street_address,
                ARRAY ['supplier'] AS roles
FROM extra_contract AS ec
         JOIN company c ON c.id = supplier_company_id
         LEFT JOIN ate_parsed a ON c.ate_id = a.id
         JOIN country cn ON c.country_id = cn.id
WHERE ec.id = :order_id
