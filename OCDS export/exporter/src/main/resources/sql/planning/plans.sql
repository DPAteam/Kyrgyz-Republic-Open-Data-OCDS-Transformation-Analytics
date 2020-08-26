SELECT pp.id              id,
       pp.account         account_number,
       pp.account_title   account_name,
       pp.amount          amount,
       pp.reserved_amount reserved_amount,
       pp.econom_amount   saved_amount,
       'KGS'::text        currency,
       pp.date_created    date_created,
       ec.code            budget_line_id,
       ec.name            budget_line_name
FROM procurement_planning pp
         JOIN econom_classifier ec ON pp.ec_classifier = ec.code
WHERE pp.procurement_planning_header_id = ?