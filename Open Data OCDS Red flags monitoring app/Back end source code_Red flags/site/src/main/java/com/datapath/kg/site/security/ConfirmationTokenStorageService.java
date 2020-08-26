package com.datapath.kg.site.security;

import com.datapath.kg.site.util.exception.CustomException;
import com.datapath.kg.site.util.exception.ExceptionInfo;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class ConfirmationTokenStorageService {

    private static Cache<String, String> tokenStorage = CacheBuilder
            .newBuilder()
            .expireAfterWrite(24, TimeUnit.HOURS)
            .build();

    public void add(String email, String token) {
        log.info("Added confirmation token: {}", token);
        tokenStorage.put(email, token);
    }

    public void removed(String email) {
        tokenStorage.put(email, "");
    }

    public String getEmail(String token) {
        for (Map.Entry<String, String> entry : tokenStorage.asMap().entrySet()) {
            if (entry.getValue().equals(token)) {
                return entry.getKey();
            }
        }
        throw new CustomException(ExceptionInfo.RP2);
    }

    public boolean isPresent(String token) {
        return tokenStorage.asMap().containsValue(token);
    }
}
