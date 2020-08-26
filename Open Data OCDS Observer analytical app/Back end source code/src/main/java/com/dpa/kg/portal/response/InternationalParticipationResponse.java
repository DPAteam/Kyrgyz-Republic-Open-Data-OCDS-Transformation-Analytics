package com.dpa.kg.portal.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
public class InternationalParticipationResponse {

    private List<CountryAmount> suppliersCountries;
    private List<CountryAmount> top10NonResidentSupplierCountries;

    //mocks
    private Long top10CountriesAmount;
    private Long othersCountriesAmount;
    private List<Bubble> bubbles;

    private List<Cpv> top5CPV;
    private List<StringLong> suppliersRegions;

    public InternationalParticipationResponse() {
        top10CountriesAmount = 8134232300L;
        othersCountriesAmount = 2134119300L;

        bubbles = new ArrayList<>();

        bubbles.add(new Bubble("СНГ", 5340L, 9011032d, 145L));
        bubbles.add(new Bubble("Евразийский экономический союз", 2140L, 5011032d, 445L));
        bubbles.add(new Bubble("Соседи", 3340L, 811032d, 245L));
        bubbles.add(new Bubble("Европейский союз", 7340L, 91011032d, 1145L));
        bubbles.add(new Bubble("Североамериканская зона свободной торговли (NAFTA)", 6340L, 4011032d, 845L));
        bubbles.add(new Bubble("Азиатско-Тихоокеанское экономическое сотрудничество (АТЭС)", 6340L, 7011032d, 250L));

        top5CPV = new ArrayList<>();

        Cpv cpv1 = new Cpv();
        cpv1.setName("Строительные работы");
        cpv1.setResidentLotsAmount(6001332d);
        cpv1.setNonResidentLotsAmount(3001332d);

        Cpv cpv2 = new Cpv();
        cpv2.setName("Финансовые и страховые услуги");
        cpv2.setResidentLotsAmount(10001388d);
        cpv2.setNonResidentLotsAmount(31433d);

        Cpv cpv3 = new Cpv();
        cpv3.setName("Отдых и развлечения, культура и спорт");
        cpv3.setResidentLotsAmount(4001388d);
        cpv3.setNonResidentLotsAmount(0d);

        Cpv cpv4 = new Cpv();
        cpv4.setName("Медицинское оборудование, фармацевтическая продукция и предметы личной гигиены");
        cpv4.setResidentLotsAmount(8001388d);
        cpv4.setNonResidentLotsAmount(1001388d);

        top5CPV.add(cpv1);
        top5CPV.add(cpv2);
        top5CPV.add(cpv3);
        top5CPV.add(cpv4);

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Bubble {
        private String countryName;
        private Long contractsCount;
        private Double contractsAmount;
        private Long suppliersCount;
    }


}
