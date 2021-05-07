package com.datapath.kg.api;

import org.bson.types.Decimal128;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.ApplicationPidFileWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Date;
import java.util.TimeZone;

@SpringBootApplication
@EnableSwagger2
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(ApiApplication.class);
        application.addListeners(new ApplicationPidFileWriter());
        application.run(args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone(ZoneId.of("Asia/Bishkek")));
    }

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.any())
                .build();
    }

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(Arrays.asList(
                new OffsetDateTimeReadConverter(),
                new OffsetDateTimeWriteConverter(),
                new BigDecimalDecimal128Converter(),
                new Decimal128BigDecimalConverter()
        ));
    }

    static class OffsetDateTimeWriteConverter implements Converter<OffsetDateTime, Date> {
        @Override
        public Date convert(OffsetDateTime source) {
            if (source == null) return null;

            return new Date(source.toInstant().toEpochMilli());
        }
    }

    static class OffsetDateTimeReadConverter implements Converter<Date, OffsetDateTime> {
        @Override
        public OffsetDateTime convert(Date source) {
            if (source == null) return null;
            return source.toInstant().atOffset(ZoneOffset.of("+6"));
        }
    }

    //Used Decimal128 converters because by default BigDecimal saves as String type to mongo database
    private static class BigDecimalDecimal128Converter implements Converter<BigDecimal, Decimal128> {

        @Override
        public Decimal128 convert(BigDecimal source) {
            if (source == null) return null;
            return new Decimal128(source);
        }
    }

    private static class Decimal128BigDecimalConverter implements Converter<Decimal128, BigDecimal> {

        @Override
        public BigDecimal convert(Decimal128 source) {
            if (source == null) return null;
            return source.bigDecimalValue();
        }

    }

}
