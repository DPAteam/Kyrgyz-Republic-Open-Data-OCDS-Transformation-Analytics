SELECT p.id AS id
FROM extra_contract AS c
         JOIN price_of_the_product p ON p.extra_contract_id = c.id
WHERE c.type = 1
  AND c.status != 0
  AND c.id = ?