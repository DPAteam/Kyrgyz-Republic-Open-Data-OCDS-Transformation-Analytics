--liquibase formatted sql
--changeset eddy:1 splitStatements:true runAlways:true

-- DROP TABLE IF EXISTS planning_event;

CREATE TABLE IF NOT EXISTS planning_event
(
    id SERIAL CONSTRAINT planning_event_pk PRIMARY KEY,
    planning_id  INTEGER not null
        constraint fk_planning_event_to_procurement_planning_header
            references procurement_planning_header,
    date_created timestamp default now() NOT NULL,
    table_name TEXT,
    operation TEXT,
    processed BOOLEAN default false
);

-- INSERT INTO planning_event(planning_id,table_name, operation)
-- SELECT id, 'procurement_planning_header', 'initial export' FROM procurement_planning_header;

UPDATE planning_event SET processed = FALSE;
