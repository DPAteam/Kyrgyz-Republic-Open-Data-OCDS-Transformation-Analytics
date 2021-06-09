package com.datapath.kg.site.util;

import lombok.Data;

@Data
public final class Constants {

    private Constants() {
    }

    public static final String RECOVERY_SUBJECT = "Reset password";
    public static final String VERIFICATION_SUBJECT = "Account verification";

    public static final String ACCOUNT_UNLOCKED_MESSAGE = "Ваш аккаунт активирован, вы можете авторизоваться по ссылке (%s)\n" +
            "Your account has been activated successfully. You can now log in.";
    public static final String ACCOUNT_LOCKED_MESSAGE = "К сожалению, Ваш аккаунт не прошел верификацию.\n" +
            "Unfortunately, your account has not passed verification.";
    public static final String ACCOUNT_NOT_VERIFIED_MESSAGE = "К сожалению, Ваш аккаунт не прошел верификацию.\n" +
            "Unfortunately, your account has not passed verification.";

    public static final String RESET_PASSWORD_MESSAGE = "%s/reset-password?token=%s&locale=%s";

    public static final String USER_IS_DISABLED_ERROR_JSON_MESSAGE = "{\"errorMessageCode\": 2}";
    public static final String BAD_CREDENTIALS_ERROR_JSON_MESSAGE = "{\"errorMessageCode\": 1}";

    public static final String TENDER_STATUS_FIELD_NAME = "tenderStatusDetails";
    public static final String TENDER_ID_FIELD_NAME = "tenderId";
    public static final String TENDER_AMOUNT_FIELD_NAME = "tenderAmount";
    public static final String CPV_FIELD_NAME = "itemCpv";
    public static final String HAS_COMPLAINTS_FIELD_NAME = "hasComplaints";
    public static final String BUYER_ID_FIELD_NAME = "buyerId";
    public static final String BUYER_NAME_FIELD_NAME = "buyerName";
    public static final String TENDER_METHOD_FIELD_NAME = "tenderProcurementMethodDetails";
    public static final String BUYER_REGION_FIELD_NAME = "buyerRegion";
    public static final String RISK_LEVEL_FIELD_NAME = "riskLevel";
    public static final String RISKED_INDICATORS_FIELD_NAME = "indicatorsWithRisk";
    public static final String TENDER_DATE_PUBLISHED_FIELD_NAME = "tenderDatePublished";
    public static final String LINK_FIELD_NAME = "link";

    public static final String CONTRACT_PROCEDURE_ID_START = "EC-";
    public static final String CONTRACT_PROCEDURE_PORTAL_LINK = "http://zakupki.gov.kg/popp/view/order/single_source_procurement.xhtml";

    public static final String TENDER_STATUS_PREFIX = "status-detail.";
    public static final String TENDER_METHOD_PREFIX = "procurement-method-details.";
    public static final String TENDER_RISK_LEVEL_PREFIX = "risk-level.";
    public static final String REGION_PREFIX = "region.";
    public static final String HAS_COMPLAINT_PREFIX = "complaint.";
    public static final String HEADER_NAME_PREFIX = "header.";

    public static final String EN_LOCALE = "en";
    public static final String RU_LOCALE = "ru";
    public static final String KY_LOCALE = "ky";
}
