--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_mkrai_17()
    RETURNS VOID AS
$$
DECLARE
    _tender                RECORD;
    _tender_data           RECORD;
    _cpv_table_sum         DOUBLE PRECISION;
    _result_sum            DOUBLE PRECISION;
    _indicator_value       integer;
    _INDICATOR_ID CONSTANT integer := 17;
    PASSED        CONSTANT integer := 1;
    FAILED        CONSTANT integer := 0;

BEGIN

    FOR _tender IN SELECT t.id, t.date_published, t.buyer_id, t.date
                   FROM tender t
                   WHERE t.procurement_method_details = 'singleSource'
                     AND t.status_details in ('evaluationComplete', 'contractSignPending')
                     AND extract(year from t.date_published) = extract(year from now())
                     AND t.procurement_method_rationale = 'annualProcurement'
                     AND t.bad_quality is false
        LOOP
            DELETE FROM tender_indicator WHERE indicator_id = _INDICATOR_ID AND tender_id = _tender.id;

            _indicator_value = FAILED;

            FOR _tender_data IN SELECT _tender.buyer_id                           as buyer_id,
                                       p.id                                       as supplier_id,
                                       substring(i.classification_id, 1, 6)       as classification_code,
                                       sum(i.quantity * pp.unit_value_amount)     as amount,
                                       _tender.date                               as date,
                                       EXTRACT(YEARS FROM _tender.date_published) as year
                                FROM award a
                                         JOIN bid b on a.bid_id = b.id
                                         JOIN price_proposal pp on pp.bid_id = b.id
                                         JOIN item i on i.id = pp.item_id
                                         JOIN party p ON p.id = b.bidder_id
                                WHERE a.tender_id = _tender.id
                                  AND a.status = 'active'
                                group by buyer_id, supplier_id, classification_code, date, year
                LOOP

                    SELECT sum(amount)
                    FROM cpv_one_supplier
                    WHERE buyer_id = _tender_data.buyer_id
                      AND supplier_id = _tender_data.supplier_id
                      AND classification_code = _tender_data.classification_code
                      AND date < _tender_data.date
                      AND year = _tender_data.year
                    INTO _cpv_table_sum;

                    _result_sum = _cpv_table_sum + _tender_data.amount;

                    IF _result_sum > 1000000
                    THEN
                        _indicator_value = PASSED;
                        EXIT;
                    END IF;

                END LOOP;

            INSERT INTO tender_indicator VALUES (_tender.id, _INDICATOR_ID, _indicator_value, now());

        END LOOP;

END;
$$
    LANGUAGE 'plpgsql';