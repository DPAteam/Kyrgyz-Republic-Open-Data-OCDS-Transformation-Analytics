SELECT l.id AS id
FROM orders o
         JOIN lot l ON o.id = l.order_id
         JOIN attachment att ON (att.id = l.pre_qualification_attachment OR att.id = l.time_table_id)
WHERE att.id = ?