--liquibase formatted sql

--changeset author:eddy runOnChange:true splitStatements:false

CREATE OR REPLACE FUNCTION planning_event_trigger() RETURNS trigger AS
$BODY$
BEGIN

    INSERT INTO planning_event(planning_id ,table_name, operation)
    VALUES (NEW.procurement_planning_header_id, tg_table_name, tg_op);
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS planning_event_tg ON procurement_planning;

CREATE TRIGGER planning_event_tg
    AFTER INSERT
        OR UPDATE OF account,account_title, amount,reserved_amount, econom_amount, date_created, ec_classifier
    ON procurement_planning
    FOR EACH ROW
EXECUTE PROCEDURE planning_event_trigger();

