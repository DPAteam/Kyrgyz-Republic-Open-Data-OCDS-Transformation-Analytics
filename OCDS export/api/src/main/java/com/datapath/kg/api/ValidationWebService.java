package com.datapath.kg.api;

import com.datapath.kg.api.dao.ValidationDAOService;
import com.datapath.kg.common.validation.ValidationReport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class ValidationWebService {

    @Autowired
    private MailSender emailSender;

    @Autowired
    private ValidationDAOService dao;

    public void saveValidationReport(ValidationReport report) {
        report.getTenders().setResult(dao.getTendersReport());
        report.getContracts().setResult(dao.getContractsReport());
        report.getPlanning().setResult(dao.getPlanningReport());
        report.setDate(LocalDateTime.now().toString());
        dao.saveReport(report);

//        sendEmailReport();
    }

    private void sendEmailReport() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("eduard.david@introlab-systems.com");
        message.setTo("eduard.david9@gmail.com");
        message.setSubject("KG valication report");
        message.setText("Success");
        emailSender.send(message);
    }

    public ValidationReport getReport(LocalDate date) {
        return dao.getReport(date);
    }
}
