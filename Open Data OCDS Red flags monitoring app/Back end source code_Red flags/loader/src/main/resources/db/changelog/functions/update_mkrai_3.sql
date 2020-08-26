--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_3()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 3;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN
    FOR _tender IN SELECT t.id, t.buyer_id
                   FROM tender t
                   WHERE t.procurement_method_details = 'singleSource'
                     and t.status_details = 'published'
                     and t.procurement_method_rationale = 'additionalProcurement5'
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;

            if exists(
                    select *
                    from additional_procurements
                    where party_id = _tender.buyer_id
                      and cpv in (
                        select cpv
                        from tender_cpv_list
                        where tender_id = _tender.id
                    )
                ) then
                _indicator_value = _PASSED;
            end if;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$ LANGUAGE plpgsql;