--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_8()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _lot_id                integer;
    _one_bidder_lot_count  integer;
    _bidders_count         integer;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 8;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT id, buyer_id
                   FROM tender t
                   WHERE (t.procurement_method_details = 'oneStage'
                       or (t.procurement_method_details = 'twostage' and
                           exists(select * from related_process where tender_id = t.id)))
                     and t.status_details in ('bidsOpened', 'evaluationResultsPending')
                     AND t.bad_quality is false

        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;

            for _lot_id in select l.id from lot l where tender_id = _tender.id
                loop
                    select count(distinct b.bidder_id)
                    from bid b
                             join bid_lot bl on b.id = bl.bid_id
                    where b.status in ('active', 'pending', 'valid')
                      and bl.lot_id = _lot_id
                    into _bidders_count;

                    if _bidders_count = 1 then
                        select count
                        from one_bidder_in_tender
                        where party_id = _tender.buyer_id
                        into _one_bidder_lot_count;

                        if _one_bidder_lot_count >= 19 then
                            _indicator_value = _PASSED;
                            exit;
                        end if;
                    end if;

                end loop;
            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$ LANGUAGE plpgsql;