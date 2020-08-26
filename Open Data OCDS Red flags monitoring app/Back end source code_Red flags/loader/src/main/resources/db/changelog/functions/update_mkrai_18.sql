--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_18()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _related_process       RECORD;
    _indicator_value       integer;
    _previous_tender       RECORD;
    _cpv_unit              RECORD;
    _previous_unit         text;
    _current_cpv_list      TEXT[];
    _previous_cpv_list     TEXT[];
    _INDICATOR_ID CONSTANT integer := 18;
    PASSED        CONSTANT integer := 1;
    FAILED        CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT id
                   FROM tender
                   WHERE status_details in ('published', 'changed')
                     AND procurement_method_details = 'singleSource'
                     AND procurement_method_rationale = 'twiceUnsuccessful'
                     AND bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = FAILED;

            SELECT id
            FROM related_process
            WHERE tender_id = _tender.id
            LIMIT 1
            INTO _related_process;

            IF _related_process IS NULL
            THEN
                INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, PASSED);
                CONTINUE;
            END IF;

            FOR _related_process IN SELECT identifier
                                    FROM related_process
                                    WHERE tender_id = _tender.id
                                      AND relationship = 'unsuccessfulProcess'
                LOOP

                    SELECT id, procurement_method_details, status_details
                    FROM tender
                    WHERE outer_id = _related_process.identifier
                    INTO _previous_tender;

                    IF _previous_tender.procurement_method_details NOT IN ('oneStage', 'simplicated', 'downgrade') OR
                       _previous_tender.status_details <> 'unsuccessful'
                    THEN
                        _indicator_value = PASSED;
                        EXIT;
                    END IF;

                    SELECT array_agg(classification_id)
                    FROM item
                    WHERE tender_id = _previous_tender.id
                    INTO _previous_cpv_list;
                    SELECT array_agg(cpv) FROM tender_cpv_list WHERE tender_id = _tender.id INTO _current_cpv_list;

                    IF _previous_cpv_list @> _current_cpv_list IS FALSE
                    THEN
                        _indicator_value = PASSED;
                        EXIT;
                    END IF;

                    FOR _cpv_unit IN SELECT distinct on (c.cpv, i.unit_id) c.cpv, i.unit_id
                                     FROM tender_cpv_list c
                                              JOIN tender t on c.tender_id = t.id
                                              JOIN item i on t.id = i.tender_id
                                     WHERE c.tender_id = _tender.id
                                       AND c.cpv = i.classification_id
                        LOOP

                            SELECT unit_id
                            FROM item
                            WHERE tender_id = _previous_tender.id
                              AND classification_id = _cpv_unit.cpv
                              AND unit_id = _cpv_unit.unit_id
                            INTO _previous_unit;

                            IF _previous_unit IS NULL
                            THEN
                                _indicator_value = PASSED;
                                EXIT;
                            END IF;

                        END LOOP;

                    IF _indicator_value = PASSED
                    THEN
                        EXIT;
                    END IF;

                END LOOP;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());

        END LOOP;

END;
$$
    LANGUAGE 'plpgsql';