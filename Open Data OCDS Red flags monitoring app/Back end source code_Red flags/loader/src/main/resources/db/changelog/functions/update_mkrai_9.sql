--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_9()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _item                  RECORD;
    _exists                boolean;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 9;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT t.id
                   FROM tender t
                   WHERE t.procurement_method_details = 'simplicated'
                     and t.status_details = 'published'
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;

            for _item in select * from item where tender_id = _tender.id and unit_name like '%условн%'
                loop
                    select exists(select *
                                  from document
                                  where tender_id = _tender.id
                                    and (item_id = _item.id or lot_id = _item.lot_id))
                    into _exists;

                    if not _exists then
                        _indicator_value = _PASSED;
                        exit;
                    end if;

                end loop;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$ LANGUAGE plpgsql;