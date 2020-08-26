--liquibase formatted sql

--changeset andrey_pylypchuk:1 splitStatements:false runOnChange:true runAlways:true

CREATE OR REPLACE FUNCTION update_transaction_variables()
    RETURNS VOID AS
$$
BEGIN
    PERFORM calc_tender_cpv_list();
END;
$$
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION update_analytic_tables()
    RETURNS VOID AS
$$
BEGIN
    PERFORM calc_pe_supplier();
    PERFORM calc_cpv_one_supplier();
    PERFORM calc_one_bidder_in_tender();
    PERFORM calc_cpv_region();
    PERFORM calc_cpv_cancelled();
    PERFORM calc_additional_procurements();
END;
$$
    LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION update_indicators()
    RETURNS VOID AS
$$
BEGIN
    PERFORM update_mkrai_2();
    PERFORM update_mkrai_3();
    PERFORM update_mkrai_4();
    PERFORM update_mkrai_5();
    PERFORM update_mkrai_6();
    PERFORM update_mkrai_7();
    PERFORM update_mkrai_8();
    PERFORM update_mkrai_9();
    PERFORM update_mkrai_10();
    PERFORM update_mkrai_12();
    PERFORM update_mkrai_13();
    PERFORM update_mkrai_14();
    PERFORM update_mkrai_15();
    PERFORM update_mkrai_16();
    PERFORM update_mkrai_17();
    PERFORM update_mkrai_18();
END;
$$
    LANGUAGE 'plpgsql';