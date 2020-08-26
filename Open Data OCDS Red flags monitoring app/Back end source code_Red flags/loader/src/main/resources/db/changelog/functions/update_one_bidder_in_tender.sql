--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

DROP FUNCTION IF EXISTS calc_one_bidder_in_tender();

CREATE OR REPLACE FUNCTION calc_one_bidder_in_tender()
    RETURNS VOID AS
$$
BEGIN
    TRUNCATE one_bidder_in_tender;
    INSERT INTO one_bidder_in_tender
    with lots as (SELECT l.id, count(*) as c
                  FROM tender t
                           JOIN lot l on t.id = l.tender_id
                           JOIN bid_lot bl on l.id = bl.lot_id
                           JOIN bid b on bl.bid_id = b.id
                  WHERE true
                    and t.bad_quality is false
                    AND t.procurement_method_details in ('oneStage', 'twostage')
                    AND b.status = 'valid'
                    AND extract(YEARS FROM t.date_published) = extract(YEARS FROM now())
                  group by l.id)
    select t.buyer_id, count(l.c)
    from lots l
             join lot on l.id = lot.id
             join tender t on t.id = lot.tender_id
    where c = 1
    group by t.buyer_id;
END;
$$
    LANGUAGE 'plpgsql';