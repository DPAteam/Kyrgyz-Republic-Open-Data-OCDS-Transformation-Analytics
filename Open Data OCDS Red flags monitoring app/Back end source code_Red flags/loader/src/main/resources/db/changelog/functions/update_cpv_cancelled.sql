--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

DROP FUNCTION IF EXISTS calc_cpv_cancelled();

CREATE OR REPLACE FUNCTION calc_cpv_cancelled()
    RETURNS VOID AS
$$
BEGIN
    TRUNCATE cpv_cancelled;
    INSERT INTO cpv_cancelled
    with cancelled_lots as (
        select t.id, t.buyer_id, l.id lot_id, t.date
        from tender t
                 join lot l on t.id = l.tender_id
        where t.status = 'cancelled'
          and t.procurement_method_details in ('oneStage', 'simplicated', 'downgrade')
          AND t.bad_quality is false
    ),
         complete_lots as (
             select t.id, t.buyer_id, l.id lot_id, t.date
             from tender t
                      join lot l on t.id = l.tender_id
             where t.procurement_method_details in ('oneStage', 'simplicated', 'downgrade')
               AND t.bad_quality is false
               AND l.status = 'cancelled'
               AND (t.status = 'complete'
                 OR (t.status = 'active' AND t.status_details = 'evaluationComplete'
                     AND (SELECT (EXTRACT(DAYS FROM now() - date) > 30)
                          FROM award
                          WHERE tender_id = t.id
                          ORDER BY date
                          LIMIT 1)
                        )
                 )
         ),
         union_data as (
             select *
             from cancelled_lots
             union
             table complete_lots
         )
    select distinct on (d.buyer_id, i.classification_id) d.buyer_id, i.classification_id, d.date
    from union_data d
             join item i on d.lot_id = i.lot_id
    order by d.buyer_id, i.classification_id, d.date desc;
END;
$$
    LANGUAGE 'plpgsql';