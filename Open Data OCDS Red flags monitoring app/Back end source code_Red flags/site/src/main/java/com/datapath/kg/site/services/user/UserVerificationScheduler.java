package com.datapath.kg.site.services.user;

import com.datapath.kg.persistence.entity.UserEntity;
import com.datapath.kg.persistence.repository.UserRepository;
import com.datapath.kg.site.services.EmailSenderService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.datapath.kg.site.util.Constants.ACCOUNT_NOT_VERIFIED_MESSAGE;
import static com.datapath.kg.site.util.Constants.VERIFICATION_SUBJECT;

@Service
@AllArgsConstructor
public class UserVerificationScheduler {

    private final UserRepository userRepository;
    private final EmailSenderService emailSenderService;

    @Scheduled(cron = "0 0 10 * * *")
    public void check() {
        List<UserEntity> users = userRepository.findAllNotVerifiedUsers();
        users.forEach(u -> {
            EmailSenderService.MessageDetails details = EmailSenderService.MessageDetails
                    .builder()
                    .subject(VERIFICATION_SUBJECT)
                    .message(ACCOUNT_NOT_VERIFIED_MESSAGE)
                    .to(u.getEmail())
                    .build();

            emailSenderService.send(details);
            u.setVerificationMailSent(true);
        });

        userRepository.saveAll(users);
    }
}
