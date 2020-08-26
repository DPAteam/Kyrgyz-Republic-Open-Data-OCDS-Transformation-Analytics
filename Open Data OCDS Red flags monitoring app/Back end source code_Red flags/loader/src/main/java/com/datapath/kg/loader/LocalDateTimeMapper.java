package com.datapath.kg.loader;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Component
public class LocalDateTimeMapper {

    public LocalDateTime asDate(String date) {
        return date != null ? ZonedDateTime.parse(date).toLocalDateTime() : null;
    }

}
