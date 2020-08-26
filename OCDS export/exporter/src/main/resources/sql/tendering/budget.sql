SELECT pph.id         AS id,
       pph.year       AS description,
       SUM(pp.amount) AS amount,
       'Годовой план' AS rationale
FROM lot l
         JOIN procurement_planning pp ON l.procurement_planning_id = pp.id
         JOIN procurement_planning_header pph ON pp.procurement_planning_header_id = pph.id
WHERE l.order_id = ?
GROUP BY pph.id;
