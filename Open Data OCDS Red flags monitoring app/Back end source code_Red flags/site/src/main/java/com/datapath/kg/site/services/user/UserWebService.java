package com.datapath.kg.site.services.user;

import com.datapath.kg.persistence.entity.UserEntity;
import com.datapath.kg.persistence.repository.BucketRepository;
import com.datapath.kg.persistence.repository.PermissionRepository;
import com.datapath.kg.persistence.repository.UserRepository;
import com.datapath.kg.site.dto.ApplicationUser;
import com.datapath.kg.site.request.user.ResetPasswordRequest;
import com.datapath.kg.site.request.user.ResetPasswordSendRequest;
import com.datapath.kg.site.request.user.UpdateUserRequest;
import com.datapath.kg.site.security.ConfirmationTokenStorageService;
import com.datapath.kg.site.security.UsersStorageService;
import com.datapath.kg.site.services.EmailSenderService;
import com.datapath.kg.site.util.UserUtils;
import com.datapath.kg.site.util.exception.CustomException;
import com.datapath.kg.site.util.exception.ExceptionInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.datapath.kg.site.util.Constants.*;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;
import static org.springframework.util.CollectionUtils.isEmpty;

@Service
public class UserWebService {

    @Value("${oauth.target-url}")
    private String TOOL_URL;

    private final UserRepository userRepository;
    private final BucketRepository bucketRepository;
    private final PermissionRepository permissionRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmailSenderService emailSender;
    private ConfirmationTokenStorageService tokenStorageService;

    private static final Integer USER_ROLE_ID = 2;
    private static final Integer ADMIN_ROLE_ID = 1;

    @Autowired
    public UserWebService(UserRepository userRepository,
                          BucketRepository bucketRepository,
                          PermissionRepository permissionRepository,
                          EmailSenderService emailSender,
                          ConfirmationTokenStorageService tokenStorageService) {
        this.userRepository = userRepository;
        this.bucketRepository = bucketRepository;
        this.permissionRepository = permissionRepository;
        this.emailSender = emailSender;
        this.tokenStorageService = tokenStorageService;
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }

    public List<ApplicationUser> list() {
        return userRepository.findAllByOrderByDateCreatedDesc()
                .stream()
                .filter(this::isNotAdmin)
                .map(UserUtils::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean exists(String email) {
        UserEntity user = userRepository.findByEmail(email);
        return user != null;
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public ApplicationUser create(ApplicationUser appUser) {
        UserEntity existed = userRepository.findByEmail(appUser.getEmail());
        if (existed != null) {
            throw new CustomException(ExceptionInfo.A2);
        }
        UserEntity user = new UserEntity();
        BeanUtils.copyProperties(appUser, user);
        user.setPassword(bCryptPasswordEncoder.encode(appUser.getPassword()));
        user.setAccountLocked(true);
        user.setVerificationMailSent(false);
        user.setPermissions(Collections.singletonList(permissionRepository.findById(USER_ROLE_ID)
                .orElseThrow(() -> new RuntimeException("User role not found")))
        );
        return UserUtils.convertToDTO(userRepository.save(user));
    }

    @Transactional
    public void delete(Integer id) {
        UserEntity user = userRepository.findOneById(id);
        bucketRepository.deleteAllByUserId(user.getId());
        userRepository.deleteById(user.getId());
        UsersStorageService.removeUser(user.getId());
    }

    public void sendMailForResetPassword(ResetPasswordSendRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail());

        if (isNull(user)) throw new CustomException(ExceptionInfo.RP3);

        String token = UUID.randomUUID().toString();

        String message = String.format(RESET_PASSWORD_MESSAGE,
                request.getPath(),
                token,
                request.getLocale());

        EmailSenderService.MessageDetails details = EmailSenderService.MessageDetails
                .builder()
                .to(request.getEmail())
                .message(message)
                .subject(RECOVERY_SUBJECT)
                .build();

        emailSender.send(details);
        tokenStorageService.add(user.getEmail(), token);
    }

    public void checkTokenForResetPassword(String token) {
        if (!tokenStorageService.isPresent(token)) throw new CustomException(ExceptionInfo.RP2);
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (tokenStorageService.isPresent(request.getToken())) {
            String email = tokenStorageService.getEmail(request.getToken());
            UserEntity user = userRepository.findByEmail(email);

            if (nonNull(user)) {
                String encodedNewPassword = bCryptPasswordEncoder.encode(request.getPassword());
                user.setPassword(encodedNewPassword);
                userRepository.save(user);
                tokenStorageService.removed(email);
                UsersStorageService.removeUser(user.getId());
            } else {
                throw new CustomException(ExceptionInfo.RP3);
            }

        } else {
            throw new CustomException(ExceptionInfo.RP2);
        }
    }

    public void update(UpdateUserRequest request) {
        if (!isEmpty(request.getUserUpdates())) {
            request.getUserUpdates().forEach(update -> {
                UserEntity entity = userRepository.findOneById(update.getId());

                if (!isNull(entity) && isNotAdmin(entity)) {
                    if (!entity.getAccountLocked().equals(update.getAccountLocked())) {
                        entity.setAccountLocked(update.getAccountLocked());

                        if (!entity.getVerificationMailSent()) entity.setVerificationMailSent(true);

                        userRepository.save(entity);

                        if (update.getAccountLocked()) {
                            UsersStorageService.removeUser(entity.getId());

                            EmailSenderService.MessageDetails details = EmailSenderService.MessageDetails
                                    .builder()
                                    .to(entity.getEmail())
                                    .message(ACCOUNT_LOCKED_MESSAGE)
                                    .subject(VERIFICATION_SUBJECT)
                                    .build();

                            emailSender.send(details);
                        } else {
                            String message = String.format(ACCOUNT_UNLOCKED_MESSAGE, TOOL_URL);
                            EmailSenderService.MessageDetails details = EmailSenderService.MessageDetails
                                    .builder()
                                    .to(entity.getEmail())
                                    .message(message)
                                    .subject(VERIFICATION_SUBJECT)
                                    .build();

                            emailSender.send(details);
                        }
                    }
                }
            });
        }
    }

    private boolean isNotAdmin(UserEntity user) {
        return user.getPermissions().stream().noneMatch(p -> ADMIN_ROLE_ID.equals(p.getId()));
    }
}
