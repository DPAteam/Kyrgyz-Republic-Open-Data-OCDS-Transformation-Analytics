package com.datapath.kg.site.services;

import lombok.Builder;
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

@Service
@Slf4j
public class EmailSenderService {

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
            log.error("Email not sent to {}. Problem with google authentication", details.to);
            e.printStackTrace();
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Email not sent to {}", details.to);
            e.printStackTrace();
        }
    }

    @Builder
    public static class MessageDetails {
        private String to;
        private String message;
        private String subject;
    }
}



