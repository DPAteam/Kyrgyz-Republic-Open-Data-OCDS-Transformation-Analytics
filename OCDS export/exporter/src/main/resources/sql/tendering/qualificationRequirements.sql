SELECT qr.id   AS     id,
       q.title AS     type,
       qr.requirement type_details
FROM qualifier_requirement qr
         JOIN qualifier q ON q.id = qr.qualifier_id
WHERE qr.order_id =?