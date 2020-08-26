package com.datapath.kg.site.controller;

import com.datapath.kg.site.response.ExceptionResponse;
import com.datapath.kg.site.util.exception.CustomException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandlerController {

    @ExceptionHandler(value = CustomException.class)
    public ResponseEntity<ExceptionResponse> exception(CustomException ex) {
        ExceptionResponse response = new ExceptionResponse(ex.getMessage());
        return new ResponseEntity<>(response, ex.getStatus());
    }
}
