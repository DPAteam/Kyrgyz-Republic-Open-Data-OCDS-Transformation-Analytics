SELECT count(DISTINCT mc.id)
FROM materialized_contract AS mc
         JOIN orders o ON o.id = mc.order_id
         JOIN materialized_contract_details md ON md.contract_id = mc.id
         JOIN price_table pt ON pt.id = md.price_table_id
WHERE o.status NOT IN (0, 1, 2)