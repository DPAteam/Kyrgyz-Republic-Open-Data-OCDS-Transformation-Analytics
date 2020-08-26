package com.datapath.kg.exporter.catalogs;

import com.datapath.kg.common.containers.LegalForm;
import com.datapath.kg.exporter.catalogs.dao.CatalogDAOService;
import com.neovisionaries.i18n.CountryCode;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Component
@AllArgsConstructor
public class LegalFormsReceiver {

    private static final String DASH = "-";
    private final CatalogDAOService daoService;

    public List<LegalForm> receive() {
        return daoService.getLegalForms().stream().map(dao -> {
            String alpha2 = CountryCode.getByCode(dao.getCountryCode()).getAlpha2();
            String organizationId = alpha2 + "-INN" + DASH + dao.getInn();

            return new LegalForm(organizationId, dao.getTitleRu());
        }).collect(toList());
    }

}
