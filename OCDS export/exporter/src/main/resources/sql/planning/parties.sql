WITH ate_parsed AS (
    WITH RECURSIVE ate_rec(id, code, tree) AS (
        SELECT id,
               code,
               name_ru :: TEXT AS tree
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
SELECT cn.iso_code      AS country_iso_code,
       c.inn            AS identifier_id,
       c.title_ru       AS legal_name_ru,
       c.title_ky       AS legla_name_kg,
       a.code           AS ate_code,
       a.country        AS country_name,
       a.region         AS region,
       a.subregion      AS subregion,
       a.district       AS district,
       a.subdistrict    AS subdistrict,
       a.subsubdistrict AS subsubdistrict,
       a.locality       AS locality,
       c.fact_address   AS street_address,
       c.id             AS company_id
FROM procurement_planning_header pph
         JOIN company c ON pph.company_id = c.id
         JOIN ate_parsed a ON a.id = c.ate_id
         JOIN country cn ON c.country_id = cn.id
WHERE pph.id = ?