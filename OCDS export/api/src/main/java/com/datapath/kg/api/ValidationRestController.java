package com.datapath.kg.api;

import com.datapath.kg.common.validation.ValidationReport;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("api/validation")
@AllArgsConstructor
public class ValidationRestController {

    private final ValidationWebService service;

    @PostMapping
    public void saveReport(@RequestBody ValidationReport report) {
        service.saveValidationReport(report);
    }

    @GetMapping
    public ValidationReport getReport(@RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate date) {
        return service.getReport(date);
    }

}
