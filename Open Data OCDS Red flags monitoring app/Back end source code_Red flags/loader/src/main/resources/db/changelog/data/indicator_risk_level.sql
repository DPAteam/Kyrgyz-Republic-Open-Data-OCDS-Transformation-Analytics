--liquibase formatted sql

--changeset eddy:1 splitStatements:false runOnChange:true

UPDATE indicator SET risk_level = 1 WHERE id = 1;
UPDATE indicator SET risk_level = 2 WHERE id = 2;
UPDATE indicator SET risk_level = 2 WHERE id = 3;
UPDATE indicator SET risk_level = 1 WHERE id = 4;
UPDATE indicator SET risk_level = 2 WHERE id = 5;
UPDATE indicator SET risk_level = 2 WHERE id = 6;
UPDATE indicator SET risk_level = 3 WHERE id = 7;
UPDATE indicator SET risk_level = 3 WHERE id = 8;
UPDATE indicator SET risk_level = 3 WHERE id = 9;
UPDATE indicator SET risk_level = 1 WHERE id = 10;
UPDATE indicator SET risk_level = 2 WHERE id = 12;
UPDATE indicator SET risk_level = 5 WHERE id = 13;
UPDATE indicator SET risk_level = 2 WHERE id = 14;
UPDATE indicator SET risk_level = 1 WHERE id = 15;
UPDATE indicator SET risk_level = 5 WHERE id = 16;
UPDATE indicator SET risk_level = 2 WHERE id = 17;
UPDATE indicator SET risk_level = 1 WHERE id = 18;