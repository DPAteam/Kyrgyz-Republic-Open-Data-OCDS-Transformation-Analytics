--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_12()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _indicator_value       integer;
    _count                 integer;
    _INDICATOR_ID CONSTANT integer := 12;
    _PASSED       CONSTANT integer := 1;
    _INCORRECT    CONSTANT integer := -1;
    _FAILED       CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT id
                   FROM tender t
                   WHERE t.procurement_method_details = 'oneStage'
                     and t.status_details in ('published', 'changed')
                     AND t.bad_quality is false

        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;
            select count(id) from qualification_requirement where tender_id = _tender.id into _count;
            if _count < 2 then
                _indicator_value = _INCORRECT;
            else
                if _count = 2 then
                    _indicator_value = _PASSED;
                end if;
            end if;
            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$
    LANGUAGE plpgsql;