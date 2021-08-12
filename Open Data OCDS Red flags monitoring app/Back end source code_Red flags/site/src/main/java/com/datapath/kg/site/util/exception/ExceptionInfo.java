package com.datapath.kg.site.util.exception;

import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

public enum ExceptionInfo {

    A2("This email already registered", BAD_REQUEST),
    E1("Too many items for export to Excel. Check less or delete something", BAD_REQUEST),
    EN1("Email not sent", BAD_REQUEST),
    RP2("Confirmation token is expired", BAD_REQUEST),
    RP3("Not found registered user", BAD_REQUEST);

    private String message;
    private HttpStatus status;

    ExceptionInfo(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
