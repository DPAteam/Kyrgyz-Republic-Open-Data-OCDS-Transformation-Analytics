SELECT p.id AS id
FROM orders o
         JOIN lot l ON o.id = l.order_id
         JOIN products p ON p.lot_id = l.id
         JOIN product_attachment pa ON pa.product_id = p.id
         JOIN attachment att ON att.id = pa.attachment_id
WHERE att.id = ?
