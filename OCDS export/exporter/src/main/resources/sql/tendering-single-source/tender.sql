SELECT ec.id                           AS id,
       ec.number                       AS tender_number,
       'complete'::text                AS status,
       'contractSigned'::text          AS status_details,
       ec.date_created                 AS date_published,
       ec.date_created                 AS date,
       'direct'::text                  AS procurement_method,
       'singleSource'::text            AS procurement_method_details,
       'standard'::text                AS procurement_sub_method_details,
       CASE
           WHEN ec.single_source_contract = 0 THEN 'forceMajeure'::text
           WHEN ec.single_source_contract = 1 THEN 'internalSecurityProvision'::text
           WHEN ec.single_source_contract = 2 THEN 'nationalSecurityProvision'::text
           WHEN ec.single_source_contract = 3 THEN 'annual3percent'::text
           END                         AS procurement_method_rationale,
       sum(p.amount * p.prce_for_unit) AS value_amount,
       'KGS'::text                     AS value_currency
FROM extra_contract AS ec
         JOIN price_of_the_product potp ON ec.id = potp.extra_contract_id
         JOIN products p ON p.id = potp.product_id
WHERE ec.type = 1
  AND ec.status != 0
  AND ec.id = ?
GROUP BY ec.id
