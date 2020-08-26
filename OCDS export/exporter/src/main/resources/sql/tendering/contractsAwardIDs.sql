SELECT mcd.price_table_id AS id
FROM materialized_contract AS mc
         JOIN materialized_contract_details mcd ON mcd.contract_id = mc.id
WHERE mc.id = :contract_id
UNION
SELECT pt.id AS id
FROM extra_contract AS ec
         JOIN price_table pt ON pt.id = ec.price_table_id
WHERE ec."type" = 0
  AND ec.status != 0
  AND ec.id = :contract_id
UNION
SELECT pt.id AS id
FROM price_table AS pt
         JOIN bid_submission AS bs ON pt.bid_submission_id = bs.id
WHERE bs.id = :contract_id
