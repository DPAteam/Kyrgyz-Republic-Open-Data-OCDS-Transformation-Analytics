--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_2()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _previous_tender       RECORD;
    _indicator_value       integer;
    _related_process       RECORD;
    _INDICATOR_ID CONSTANT integer := 2;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN
    FOR _tender IN SELECT id
                   FROM tender t
                   WHERE t.procurement_method_details = 'singleSource'
                     and t.status_details = 'published'
                     and t.procurement_method_rationale = 'additionalProcurement5'
                     AND t.bad_quality is false

        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;
            select * from related_process where tender_id = _tender.id into _related_process;

            if _related_process is null then
                _indicator_value = _PASSED;
            else
                select *
                from tender
                where tender_number = REGEXP_REPLACE(_related_process.tender_number, '[[:alpha:]]', '', 'g')
                into _previous_tender;

                if _previous_tender is null then
                    _indicator_value = _PASSED;
                else
                    if _previous_tender.procurement_method_details = 'singleSource' then
                        _indicator_value = _PASSED;
                    end if;
                end if;
            end if;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$
    LANGUAGE plpgsql;