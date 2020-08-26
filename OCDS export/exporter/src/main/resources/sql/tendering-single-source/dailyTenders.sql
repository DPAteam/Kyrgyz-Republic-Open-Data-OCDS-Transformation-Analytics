SELECT id
FROM extra_contract
WHERE type = 1
  AND status != 0
  AND date_created BETWEEN
    CURRENT_TIMESTAMP - INTERVAL '1 day' AND CURRENT_TIMESTAMP
