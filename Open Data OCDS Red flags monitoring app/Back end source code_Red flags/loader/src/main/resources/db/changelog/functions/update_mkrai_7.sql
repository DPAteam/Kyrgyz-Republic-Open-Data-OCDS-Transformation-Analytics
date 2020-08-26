--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_7()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _lot                   RECORD;
    _bid_lot_data          RECORD;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 7;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT t.id
                   FROM tender t
                   WHERE (t.procurement_method_details IN ('oneStage', 'simplicated', 'downgrade')
                       or (t.procurement_method_details = 'twostage' and
                           exists(select * from related_process where tender_id = t.id)))
                     and t.status_details in ('bidsOpened', 'evaluationResultsPending')
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;

            FOR _lot IN SELECT * FROM lot WHERE tender_id = _tender.id and status = 'active'
                LOOP

                    select min(amount) as min_value, max(amount) as max_value
                    from bid_lot
                    where lot_id = _lot.id
                    into _bid_lot_data;

                    if _bid_lot_data.max_value = 0 then
                        continue;
                    end if;

                    if (_bid_lot_data.max_value - _bid_lot_data.min_value)::double precision / _bid_lot_data.max_value *
                       100 >= 30 then
                        _indicator_value = _PASSED;
                        exit;
                    end if;

                end loop;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$
    LANGUAGE plpgsql;