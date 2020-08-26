--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_13()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _qr_type               RECORD;
    _cpv_licence           TEXT[];
    _tender_cpv            TEXT[];
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 13;
    PASSED        CONSTANT integer := 1;
    FAILED        CONSTANT integer := 0;

BEGIN

    SELECT array_agg(cpv) FROM cpv_licence INTO _cpv_licence;

    FOR _tender IN SELECT id
                   FROM tender t
                   WHERE t.procurement_method_details in ('singleSource', 'oneStage', 'downgrade', 'simplicated')
                     AND t.status_details in ('published', 'changed')
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = FAILED;

            SELECT *
            FROM qualification_requirement
            WHERE tender_id = _tender.id
              AND type = 'Лицензия, выданная уполномоченным органом'
            INTO _qr_type;

            IF _qr_type IS NULL
            THEN
                SELECT array_agg(cpv) FROM tender_cpv_list WHERE tender_id = _tender.id INTO _tender_cpv;

                IF _cpv_licence && _tender_cpv IS TRUE THEN
                    _indicator_value = PASSED;
                END IF;

            END IF;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());

        END LOOP;

END;
$$
    LANGUAGE 'plpgsql';