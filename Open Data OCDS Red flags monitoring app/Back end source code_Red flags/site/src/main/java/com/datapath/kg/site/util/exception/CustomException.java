package com.datapath.kg.site.util.exception;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException {

    private HttpStatus status;

    public CustomException(ExceptionInfo exInfo) {
        super(exInfo.getMessage());
        status = exInfo.getStatus();
    }

    public HttpStatus getStatus() {
        return status;
    }
}
