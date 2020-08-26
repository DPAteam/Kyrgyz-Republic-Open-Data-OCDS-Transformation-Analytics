SELECT id
FROM orders
WHERE status NOT IN (0, 1, 2)
  AND framework_agreement IS NOT TRUE
  AND date_published BETWEEN
    CURRENT_TIMESTAMP - INTERVAL '1 day' AND CURRENT_TIMESTAMP
ORDER BY date_published DESC
