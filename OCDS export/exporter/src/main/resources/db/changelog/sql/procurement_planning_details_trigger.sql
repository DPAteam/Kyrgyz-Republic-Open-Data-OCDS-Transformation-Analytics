--liquibase formatted sql

--changeset author:eddy runOnChange:true splitStatements:false

CREATE OR REPLACE FUNCTION planning_details_event_trigger() RETURNS trigger AS
$$
BEGIN

    INSERT INTO planning_event(planning_id, table_name, operation)
    VALUES ((SELECT procurement_planning_header_id FROM procurement_planning WHERE id = NEW.procurement_planning_id),
            tg_table_name,
            tg_op);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS planning_details_event_tg ON procurement_planning_detail;

CREATE TRIGGER planning_details_event_tg
    AFTER INSERT OR UPDATE OF amount, price_for_one_unit, okgz_id, measurement_unit_id
    ON procurement_planning_detail
    FOR EACH ROW
EXECUTE PROCEDURE planning_details_event_trigger();


