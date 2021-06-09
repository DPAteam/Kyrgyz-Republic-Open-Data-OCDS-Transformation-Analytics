package com.datapath.kg.loader.handlers;

import com.datapath.kg.loader.dto.ReleaseDTO;
import com.datapath.kg.loader.service.NotificationService;
import com.datapath.kg.persistence.entity.ReleasePersistFailHistoryEntity;
import com.datapath.kg.persistence.entity.UserEntity;
import com.datapath.kg.persistence.repository.UserRepository;
import com.datapath.kg.persistence.service.ReleasePersistFailHistoryDAOService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import static com.datapath.kg.loader.utils.Constants.MESSAGE_SUBJECT;
import static com.datapath.kg.loader.utils.Constants.MESSAGE_TEMPLATE;
import static java.util.stream.Collectors.toSet;

@Slf4j
@Component
public class ReleasePersistFailHandler {

    private final Set<String> to;

    private final ReleasePersistFailHistoryDAOService releaseHistoryDAOService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public ReleasePersistFailHandler(@Value("${notification.receivers}") String to,
                                     ReleasePersistFailHistoryDAOService releaseHistoryDAOService,
                                     NotificationService notificationService,
                                     UserRepository userRepository) {
        this.releaseHistoryDAOService = releaseHistoryDAOService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;

        if (StringUtils.isEmpty(to)) this.to = new HashSet<>();
        else this.to = Arrays.stream(to.split(",")).collect(toSet());
    }

    @Transactional
    public void handle(ReleaseDTO releaseDTO, Exception e) {
        log.warn("{} release threw error", releaseDTO.getOcid());
        log.warn(e.getMessage());

        ReleasePersistFailHistoryEntity entity = prepareFailEntity(releaseDTO, e);
        releaseHistoryDAOService.save(entity);
        notificationService.send(prepareMessageDetail(entity));
    }

    private NotificationService.MessageDetails prepareMessageDetail(ReleasePersistFailHistoryEntity entity) {
        NotificationService.MessageDetails details = new NotificationService.MessageDetails();

        details.setSubject(MESSAGE_SUBJECT);
        details.setMessage(prepareMessage(entity));
        details.setTo(prepareReceivers());

        return details;
    }

    private String[] prepareReceivers() {
        to.addAll(userRepository.findAdmins().stream().map(UserEntity::getEmail).collect(Collectors.toList()));
        return to.toArray(new String[0]);
    }

    private String prepareMessage(ReleasePersistFailHistoryEntity entity) {
        return String.format(MESSAGE_TEMPLATE,
                entity.getOcid(),
                entity.getId(),
                entity.getDate().toString(),
                entity.getTenderNumber(),
                entity.getFailDate().toString(),
                entity.getException(),
                entity.getMessage());
    }

    private ReleasePersistFailHistoryEntity prepareFailEntity(ReleaseDTO releaseDTO, Exception e) {
        ReleasePersistFailHistoryEntity entity = new ReleasePersistFailHistoryEntity();
        entity.setOcid(releaseDTO.getOcid());
        entity.setId(releaseDTO.getId());
        entity.setDate(releaseDTO.getDate());
        entity.setTenderNumber(releaseDTO.getTender().getTenderNumber());
        entity.setFailDate(OffsetDateTime.now());
        entity.setException(e.getClass().getSimpleName());
        entity.setMessage(e.getMessage());
        entity.setStackTrace(toString(e.getStackTrace()));
        return entity;
    }

    private String toString(StackTraceElement[] stackTrace) {
        if (stackTrace.length == 0) return null;

        return Arrays.stream(stackTrace)
                .map(StackTraceElement::toString)
                .collect(Collectors.joining("\n"));
    }
}
