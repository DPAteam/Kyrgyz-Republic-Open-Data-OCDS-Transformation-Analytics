SELECT id
FROM orders
WHERE status NOT IN (0, 1, 2)
AND framework_agreement IS NOT TRUE
ORDER BY date_published DESC
