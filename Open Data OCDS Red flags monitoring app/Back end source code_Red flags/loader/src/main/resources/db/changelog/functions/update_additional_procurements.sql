--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

DROP FUNCTION IF EXISTS calc_additional_procurements();

CREATE OR REPLACE FUNCTION calc_additional_procurements()
    RETURNS VOID AS
$$
BEGIN
    TRUNCATE additional_procurements;
    INSERT INTO additional_procurements
    select distinct on (t.buyer_id, tcl.cpv) t.buyer_id, tcl.cpv
    from tender t
             join tender_cpv_list tcl on t.id = tcl.tender_id
    WHERE t.procurement_method_rationale = 'additionalProcurement5'
      AND extract(YEARS FROM t.date_published) = extract(YEARS FROM now())
      AND t.status_details = 'contractSigned'
      AND t.bad_quality IS FALSE;
END;
$$
    LANGUAGE 'plpgsql';