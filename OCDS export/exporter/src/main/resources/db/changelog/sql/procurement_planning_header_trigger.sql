--liquibase formatted sql

--changeset author:eddy runOnChange:true splitStatements:false

CREATE OR REPLACE FUNCTION planning_header_event_trigger() RETURNS trigger AS
$BODY$
BEGIN

    INSERT INTO planning_event(planning_id, table_name, operation)
    VALUES (NEW.id, tg_table_name, tg_op);
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS planning_header_event_tg ON procurement_planning_header;

CREATE TRIGGER planning_header_event_tg
    AFTER INSERT OR UPDATE OF year,date_created, date_last_changed, planning_status, planning_type, total_sum, company_id
    ON procurement_planning_header
    FOR EACH ROW
EXECUTE PROCEDURE planning_header_event_trigger();


