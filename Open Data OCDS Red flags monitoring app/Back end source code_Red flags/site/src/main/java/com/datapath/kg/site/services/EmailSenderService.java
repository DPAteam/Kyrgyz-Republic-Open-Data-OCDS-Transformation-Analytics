package com.datapath.kg.site.services;

import com.datapath.kg.site.request.ResetPasswordSendRequest;
import com.datapath.kg.site.util.exception.CustomException;
import com.datapath.kg.site.util.exception.ExceptionInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailSenderService {

    private static final String TOOL_NAME = "KG Red Flags";
    private static final String RECOVERY_SUBJECT = "Reset password";
    private static final String MESSAGE_TEMPLATE = "%s/reset-password?token=%s&locale=%s";

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String FROM;

    public void send(ResetPasswordSendRequest request, String token) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, StandardCharsets.UTF_8.displayName());
        try {
            message.setSubject(RECOVERY_SUBJECT);
            message.setTo(request.getEmail());
            message.setFrom(FROM, TOOL_NAME);

            String redirectUrl = String.format(MESSAGE_TEMPLATE,
                    request.getPath(),
                    token,
                    request.getLocale());

            message.setText(redirectUrl, false);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new CustomException(ExceptionInfo.RP1);
        }
    }
}



