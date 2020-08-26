package com.datapath.kg.persistence.utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtils {

    public static String formatToString(Date date, String formatter) {
        DateFormat dateFormat = new SimpleDateFormat(formatter);
        return dateFormat.format(date);
    }
}
