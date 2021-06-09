package com.datapath.kg.loader;

import com.datapath.kg.loader.handlers.IndicatorDataHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.time.ZoneId;
import java.util.TimeZone;

@Slf4j
@EnableScheduling
@SpringBootApplication
@EnableTransactionManagement
@ComponentScan(basePackages = {"com.datapath.kg"})
@EntityScan(basePackages = {"com.datapath.kg"})
@EnableJpaRepositories(basePackages = {"com.datapath.kg"})
public class LoaderRisksApplication {

    @Autowired
    private ReleaseLoader loader;
    @Autowired
    private IndicatorDataHandler analyticDataHandler;

    public static void main(String[] args) {
        SpringApplication.run(LoaderRisksApplication.class, args);
    }

    @Scheduled(fixedDelayString = "${indicator.reload.delay}")
    public void run() {
        try {
            loader.run();
            analyticDataHandler.handle();
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
    }

    @Bean
    public RestTemplate restTemplate(@Value("${api.url}") String apiUrl) {

        DefaultUriBuilderFactory builderFactory = new DefaultUriBuilderFactory();
        builderFactory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.VALUES_ONLY);

        return new RestTemplateBuilder()
                .rootUri(apiUrl)
                .uriTemplateHandler(builderFactory)
                .setConnectTimeout(Duration.ofMinutes(1))
                .setReadTimeout(Duration.ofMinutes(1))
                .build();
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.of("Asia/Bishkek")));
    }
}
