--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_10()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _exists                boolean;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 10;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT t.id
                   FROM tender t
                   WHERE t.procurement_method_details IN ('oneStage', 'simplicated', 'downgrade')
                     and t.status_details = 'published'
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;

            select exists(select *
                          from item
                          where tender_id = _tender.id
                            and unit_name ilike '%условн%')
            into _exists;

            if _exists then
                _indicator_value = _PASSED;
            end if;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$ LANGUAGE plpgsql;