--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_5()
    RETURNS void AS
$$
DECLARE
    _tender                RECORD;
    _condition             RECORD;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 5;
    _PASSED       CONSTANT integer := 1;
    _FAILED       CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT t.id
                   FROM tender t
                   WHERE (t.procurement_method_details IN ('oneStage', 'simplicated', 'downgrade')
                       or (t.procurement_method_details = 'twostage' and
                           exists(select * from related_process where tender_id = t.id)))
                     and t.status_details in ('published', 'changed')
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = _FAILED;

            select * from condition_of_contract where tender_id = _tender.id into _condition;

            if _condition is null or
               ((_condition.late_delivery_rate is null or _condition.late_delivery_rate = '0.0') and
                (_condition.late_payment_rate is null or _condition.late_payment_rate = '0.0') and
                (_condition.late_guarantee_rate is null or _condition.late_guarantee_rate = '0') and
                (_condition.guarantee_percent is null or _condition.guarantee_percent = '0.0') and
                (_condition.max_deductible_amount_delivery is null or
                 _condition.max_deductible_amount_delivery = '0.0') and
                (_condition.max_deductible_amount_payment is null or
                 _condition.max_deductible_amount_payment = '0.0') and
                (_condition.max_deductible_amount_guarantee is null or
                 _condition.max_deductible_amount_guarantee = '0.0') and
                (_condition.has_guarantee is null or _condition.has_guarantee is false) and
                (_condition.has_insurance is null or _condition.has_insurance is false) and
                (_condition.has_technical_control is null or _condition.has_technical_control is false)) then
                _indicator_value = _PASSED;
            end if;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());
        END LOOP;
END;
$$ LANGUAGE plpgsql;