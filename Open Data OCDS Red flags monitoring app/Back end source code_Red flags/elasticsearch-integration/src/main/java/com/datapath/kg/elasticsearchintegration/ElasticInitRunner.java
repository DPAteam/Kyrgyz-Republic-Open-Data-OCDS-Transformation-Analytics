package com.datapath.kg.elasticsearchintegration;

import com.datapath.kg.elasticsearchintegration.services.TenderObjectsProvider;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class ElasticInitRunner implements CommandLineRunner {

    private final TenderObjectsProvider provider;

    public ElasticInitRunner(TenderObjectsProvider provider) {
        this.provider = provider;
    }

    @Override
    public void run(String... args) {
        provider.initUpdate();
    }

    @Scheduled(fixedDelay = 1000 * 60 * 15, initialDelay = 1000 * 30)
    public void update() {
        provider.update();
    }

    @Bean
    public ResourceBundleMessageSource bundleMessageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
        messageSource.setBasenames("mapping", "header");
        return messageSource;
    }
}
