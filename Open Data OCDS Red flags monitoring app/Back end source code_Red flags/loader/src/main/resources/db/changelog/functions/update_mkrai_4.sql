--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_4()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _date                  timestamp;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 4;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT t.id, t.date_published, t.buyer_id
                   FROM tender t
                   WHERE t.procurement_method_details = 'singleSource'
                     and t.status_details in ('published', 'changed')
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;

            for _date in select date
                         from cpv_cancelled
                         where party_id = _tender.buyer_id
                           and cpv in (
                             select cpv
                             from tender_cpv_list
                             where tender_id = _tender.id
                         )
                loop

                    if _tender.date_published::date - _date::date <= 5 then
                        _indicator_value = _PASSED;
                        exit;
                    end if;

                end loop;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$ LANGUAGE plpgsql;