--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_16()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _result_sum            DOUBLE PRECISION;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 16;
    PASSED        CONSTANT integer := 1;
    FAILED        CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT id
                   FROM tender t
                   WHERE t.procurement_method_details = 'simplicated'
                     AND t.status_details in ('published', 'changed')
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = FAILED;

            SELECT sum(value_amount) from lot where status = 'active' and tender_id = _tender.id into _result_sum;

            IF _result_sum > 1000000
            THEN
                _indicator_value = PASSED;
            END IF;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());

        END LOOP;

END;
$$
    LANGUAGE 'plpgsql';