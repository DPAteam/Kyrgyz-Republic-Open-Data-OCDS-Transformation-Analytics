--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

DROP FUNCTION IF EXISTS calc_cpv_region();

CREATE OR REPLACE FUNCTION calc_cpv_region()
    RETURNS VOID AS
$$
BEGIN
    TRUNCATE cpv_region;
    INSERT INTO cpv_region
    with lot_bidder_count as (select l.id, l.tender_id, count(distinct b.bidder_id) bidder_count
                              from tender t
                                       join lot l on t.id = l.tender_id
                                       join bid_lot bl on l.id = bl.lot_id
                                       join bid b on bl.bid_id = b.id
                              WHERE t.procurement_method_details IN ('oneStage', 'simplicated', 'downgrade')
                                AND (t.status = 'complete'
                                  OR (t.status = 'active' AND
                                      t.status_details = 'evaluationComplete' AND
                                      (SELECT (EXTRACT(DAYS FROM now() - date) > 30)
                                       FROM award
                                       WHERE tender_id = t.id
                                       ORDER BY date
                                       LIMIT 1)
                                         )
                                  )
                                AND t.bad_quality IS FALSE
                                and (l.status = 'active' or l.status = 'complete')
                              group by l.id)
    select p.region, i.classification_id, round(avg(l.bidder_count), 2)
    from lot_bidder_count l
             join item i on i.lot_id = l.id
             join tender t on l.tender_id = t.id
             join party p on t.buyer_id = p.id
    where p.region is not null
    group by p.region, i.classification_id;
END;
$$
    LANGUAGE 'plpgsql';