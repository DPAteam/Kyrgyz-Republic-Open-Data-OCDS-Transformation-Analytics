SELECT oc.id                 AS id,
       CASE
           WHEN oc.status = 0 THEN 'published'::text
           WHEN oc.status = 1 THEN 'active'::text
           WHEN oc.status = 2 THEN 'cancelled'::text
           WHEN oc.status = 3 THEN 'complete'::text
           WHEN oc.status = 4 THEN 'withdrawn'::text
           END               AS status,
       oc.date_created       AS date_submitted,
       oc.type               AS type,
       oc.number             AS complaint_number,
       oc.subject            AS title,
       oc.content            AS description,
       cn.iso_code           AS country_iso_code,
       c.inn                 AS author_id,
       oc.date_consideration AS review_date,
       oc.date_answer        AS response_date,
       oc.response           AS resolution
FROM order_complaint oc
         JOIN company c ON c.id = oc.applicant_company_id
         JOIN country cn ON c.country_id = cn.id
WHERE oc.order_id = ?
