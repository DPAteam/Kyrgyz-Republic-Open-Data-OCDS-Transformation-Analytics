SELECT COUNT(id)
FROM orders
WHERE status NOT IN (0, 1, 2)
  AND framework_agreement IS NOT TRUE