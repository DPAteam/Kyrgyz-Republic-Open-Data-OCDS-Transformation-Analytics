SELECT att.id           AS id,
       att.file_name    AS title,
       att.date_created AS date_created
FROM attachment AS att
         JOIN orders AS o ON att.id = o.reason_attachment_id
WHERE o.id = :tender_id
UNION
SELECT att.id           AS id,
       att.file_name    AS title,
       att.date_created AS date_created
FROM orders o
         JOIN lot l ON o.id = l.order_id
         JOIN attachment att ON (att.id = l.pre_qualification_attachment OR att.id = l.time_table_id)
WHERE o.id = :tender_id
UNION
SELECT att.id           AS id,
       att.file_name    AS title,
       att.date_created AS date_created
FROM orders o
         JOIN lot l ON o.id = l.order_id
         JOIN products p ON p.lot_id = l.id
         JOIN product_attachment pa ON pa.product_id = p.id
         JOIN attachment att ON att.id = pa.attachment_id
WHERE o.id = :tender_id
UNION
SELECT att.id           AS id,
       att.file_name    AS title,
       att.date_created AS date_created
FROM orders o
         JOIN order_complaint oc ON oc.order_id = o.id
         JOIN order_complaint_attachment oca ON oca.order_complaint_id = oc.id
         JOIN attachment att ON att.id = oca.attachment_id
WHERE o.id = :tender_id
