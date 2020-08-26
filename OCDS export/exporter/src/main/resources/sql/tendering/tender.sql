SELECT o.id                                                AS id,
       o.name                                              AS title,
       o.number                                            AS tender_number,
       o.warranty_provision                                AS guarantee_amount,
       o.allow_monetary_value                              AS guarantee_monetary,
       CASE
           WHEN o.status IN (3, 4, 6, 8, 9, 10, 11, 12, 13, 15) THEN 'active'::text
           WHEN o.status = 5 THEN 'cancelled'::text
           WHEN o.status = 14 THEN 'unsuccessful'::text
           WHEN o.status = 7 THEN 'complete'::text
           END                                             AS status,
       CASE
           WHEN o.status = 3 THEN 'published'::text
           WHEN o.status = 4 THEN 'changed'::text
           WHEN o.status = 5 THEN 'cancelled'::text
           WHEN o.status = 6 THEN 'evaluationComplete'::text
           WHEN o.status = 7 AND o.previous_number IS NULL AND o.pre_qualification = TRUE THEN 'firstStageComplete'::text
           WHEN o.status = 7 AND o.previous_number IS NULL AND o.pre_qualification IS NOT TRUE AND
                o.procurement_method IN (3, 11, 12) THEN 'firstStageComplete'::text
           WHEN o.status = 7 AND o.previous_number IS NULL AND o.pre_qualification IS NOT TRUE AND
                o.procurement_method NOT IN (3, 11, 12) THEN 'contractSigned'::text
           WHEN o.status = 7 AND o.previous_number IS NOT NULL THEN 'contractSigned'::text
           WHEN o.status = 8 THEN 'bidsOpened'::text
           WHEN o.status = 9 THEN 'autoProlonged'::text
           WHEN o.status = 10 THEN 'evaluationResultsPending'::text
           WHEN o.status = 11 THEN 'contractSignPending'::text
           WHEN o.status = 12 THEN 'firstPackagePending'::text
           WHEN o.status = 13 THEN 'secondPackageOpened'::text
           WHEN o.status = 14 THEN 'unsuccessful'::text
           WHEN o.status = 15 THEN 'firstPackageEvaluated'::text
           END                                             AS status_details,
       o.date_published                                    AS date_published,
       (SELECT max(date_created)
        FROM (
                 SELECT min(oc.date_created) AS date_created
                 FROM order_hronology oc
                 WHERE oc.order_id = o.id
                   AND oc.type IN (0, 1, 2, 4, 5, 6)
                 UNION
                 SELECT oc.date_created AS date_created
                 FROM order_hronology oc
                 WHERE oc.order_id = o.id
                   AND oc.type IN (3, 7, 8)) t)            AS date,
       CASE
           WHEN o.procurement_method IN (0, 1, 5, 7, 8, 9) THEN 'open'::text
           WHEN o.procurement_method IN (4, 6) AND o.only_previously_signed_companies = TRUE THEN 'selective'::text
           WHEN o.procurement_method IN (4, 6) AND o.only_previously_signed_companies = FALSE THEN 'open'::text
           WHEN o.procurement_method IN (4, 6) AND o.only_previously_signed_companies IS NULL THEN 'open'::text
           WHEN o.procurement_method = 15 AND o.only_previously_signed_companies = TRUE THEN 'limited'::text
           WHEN o.procurement_method = 15 AND o.only_previously_signed_companies = FALSE THEN 'selective'::text
           WHEN o.procurement_method IN (3, 10, 11, 12, 13, 14, 15, 16) AND o.only_previously_signed_companies IS NULL
               THEN 'selective'::text
           WHEN o.procurement_method IN (2, 17) THEN 'limited'::text
           END                                             AS procurement_method,
       CASE
           WHEN o.procurement_method = 0 THEN 'egov'::text
           WHEN o.procurement_method = 1 THEN 'auctionUnlimited'::text
           WHEN o.procurement_method = 2 THEN 'auctionLimited'::text
           WHEN o.procurement_method = 3 THEN 'twostage'::text
           WHEN o.procurement_method = 4 THEN 'requestForQuotation'::text
           WHEN o.procurement_method = 5 THEN 'eAuction'::text
           WHEN o.procurement_method = 6 THEN 'singleSource'::text
           WHEN o.procurement_method IN (7, 16) THEN 'oneStage'::text
           WHEN o.procurement_method = 8 THEN 'simplicated'::text
           WHEN o.procurement_method = 9 THEN 'downgrade'::text
           WHEN o.procurement_method = 10 THEN 'consultQualityPrice'::text
           WHEN o.procurement_method = 11 THEN 'consultQuality'::text
           WHEN o.procurement_method = 12 THEN 'consultFixedBudget'::text
           WHEN o.procurement_method = 13 THEN 'consultPrice'::text
           WHEN o.procurement_method = 14 THEN 'consultQualification'::text
           WHEN o.procurement_method = 15 THEN 'consultSingleSource'
           WHEN o.procurement_method = 17 THEN 'personific'::text
           END                                             AS procurement_method_details,
       o.pre_qualification                                 AS has_prequalification,
       CASE
           WHEN o.external_system = 0 THEN TRUE
           WHEN o.external_system <> 0 OR o.external_system IS NULL THEN FALSE
           END                                             AS has_external_system,
       CASE
           WHEN o.format IN (0, 1) THEN 'standard'::text
           WHEN o.format = 2 THEN 'framework'::text
           WHEN o.format = 3 THEN 'centralised'::text
           WHEN o.format = 4 THEN 'personific'::text
           WHEN o.format = 5 THEN 'twopackage'::text
           END                                             AS procurement_sub_method_details,
       CASE
           WHEN o.single_source_reason = 0 AND o.date_published >= date('2019-06-29') THEN 'additionalProcurement5'::text
           WHEN o.single_source_reason = 0 AND o.date_published < date('2019-06-29') THEN 'additionalProcurement15'::text
           WHEN o.single_source_reason = 1 AND o.date_published >= date('2019-06-29') THEN 'additionalProcurement5'::text
           WHEN o.single_source_reason = 1 AND o.date_published < date('2019-06-29') THEN 'additionalProcurement25'::text
           WHEN o.single_source_reason = 2 THEN 'annualProcurement'::text
           WHEN o.single_source_reason = 3 THEN 'forPenalSystem'::text
           WHEN o.single_source_reason = 4 THEN 'intellectualRights'::text
           WHEN o.single_source_reason = 5 THEN 'twiceUnsuccessful'::text
           WHEN o.single_source_reason = 6 THEN 'urgentNeed'::text
           WHEN o.single_source_reason = 7 THEN 'earlyElections'::text
           WHEN o.single_source_reason = 8 THEN 'foreignInstitutionsKR'::text
           WHEN o.single_source_reason = 9 THEN 'art'::text
           WHEN o.single_source_reason = 10 THEN 'selfReliance'::text
           WHEN o.single_source_reason = 11 THEN 'naturalMonopoly'::text
           WHEN o.single_source_reason = 12 THEN 'gov100Percent'::text
           WHEN o.single_source_reason = 13 THEN 'legalServices'::text
           WHEN o.single_source_reason = 14 THEN 'science'::text
           WHEN o.single_source_reason = 15 THEN 'forDisabled'::text
           WHEN o.single_source_reason = 16 THEN 'localMarketProtection'::text
           END                                             AS procurement_method_rationale,
       CASE
           WHEN o.order_type = 0 THEN 'product'::text
           WHEN o.order_type = 1 THEN 'work'::text
           WHEN o.order_type = 2 THEN 'service'::text
           WHEN o.order_type = 3 THEN 'consultService'::text
           END                                             AS main_procurement_category,
       o.total_sum                                         AS value_amount,
       'KGS'::text                                         AS value_currency,
       o.date_published                                    AS start_date,
       o.date_contest                                      AS end_date,
       CASE
           WHEN o.date_contest - INTERVAL '5 days' > o.date_published
               THEN o.date_published
           END                                             AS enquiry_start_date,
       CASE
           WHEN o.date_contest - INTERVAL '5 days' > o.date_published
               THEN o.date_contest - INTERVAL '5 days' END AS enquiry_end_date
FROM orders o
WHERE o.id = ?
