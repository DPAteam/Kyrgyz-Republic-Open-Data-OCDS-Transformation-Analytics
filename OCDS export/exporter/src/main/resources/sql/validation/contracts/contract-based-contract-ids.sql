SELECT ec.id
FROM extra_contract AS ec
WHERE status <> 0
  AND type = 1