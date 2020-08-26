package com.datapath.kg.site.util;

public enum Locale {

    EN("en"),
    RU("ru"),
    KY("ky");

    private String key;

    Locale(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }
}
