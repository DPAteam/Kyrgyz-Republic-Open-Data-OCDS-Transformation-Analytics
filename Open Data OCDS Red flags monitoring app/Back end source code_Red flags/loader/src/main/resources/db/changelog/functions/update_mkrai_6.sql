--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_6()
    RETURNS void AS
$$
DECLARE
    _tender                   RECORD;
    _lot                      RECORD;
    _medium_competition_level double precision;
    _indicator_value          integer;
    _INDICATOR_ID CONSTANT    integer := 6;
    _PASSED       CONSTANT    integer := 1;
    _FAILED       CONSTANT    integer := 0;

BEGIN

    FOR _tender IN SELECT t.id, p.region
                   FROM tender t
                            join party p on t.buyer_id = p.id
                   WHERE t.procurement_method_details IN ('oneStage', 'simplicated', 'downgrade')
                     and t.status_details in ('bidsOpened', 'evaluationResultsPending')
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;
            for _lot in select distinct on (l.id, i.classification_id) l.id,
                                                                       i.classification_id,
                                                                       count(distinct b.bidder_id) bidder_count
                        from lot l
                                 join item i on l.id = i.lot_id
                                 join bid_lot bl on l.id = bl.lot_id
                                 join bid b on bl.bid_id = b.id
                        where l.status = 'active'
                          and l.tender_id = _tender.id
                        group by l.id, i.classification_id
                loop
                    select medium_competition_level
                    from cpv_region
                    where region = _tender.region
                      and cpv = _lot.classification_id
                    into _medium_competition_level;

                    if _medium_competition_level is not null then
                        if (_medium_competition_level - _lot.bidder_count)::double precision /
                           _medium_competition_level * 100 >= 30 then
                            _indicator_value = _PASSED;
                            exit;
                        end if;
                    end if;

                end loop;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$
    LANGUAGE plpgsql;