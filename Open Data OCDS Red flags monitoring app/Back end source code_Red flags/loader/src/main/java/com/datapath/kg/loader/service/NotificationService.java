package com.datapath.kg.loader.service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.AuthenticationFailedException;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String FROM;
    @Value("${tool.name}")
    private String TOOL_NAME;

    public void send(MessageDetails details) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.displayName());
        try {
            message.setSubject(details.subject);
            message.setTo(details.to);
            message.setFrom(FROM, TOOL_NAME);

            message.setText(details.message, false);
            javaMailSender.send(mimeMessage);
        } catch (AuthenticationFailedException e) {
            log.error("Email not sent. Problem with google authentication");
            e.printStackTrace();
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Email not sent");
            e.printStackTrace();
        }
    }

    @Data
    public static class MessageDetails {
        private String[] to;
        private String message;
        private String subject;
    }
}
