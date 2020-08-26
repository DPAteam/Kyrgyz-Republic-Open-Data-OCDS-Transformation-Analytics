package com.datapath.kg.persistence.service;

import com.datapath.kg.persistence.domain.BaseEntitiesCountData;
import com.datapath.kg.persistence.domain.TenderData;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TenderDataService {

    private final JdbcTemplate template;

    private static final String QUERY = "with tender_indicators as (select ti.tender_id,\n" +
            "                                  string_agg(indicator_id::text, ',') FILTER ( WHERE indicator_value > 0 ) AS indicators_with_risk,\n" +
            "                                  string_agg(indicator_id::text, ',') FILTER ( WHERE indicator_value = 0 ) AS indicators_without_risk,\n" +
            "                                  string_agg(indicator_id::text, ',')                                      AS indicators,\n" +
            "                                  COALESCE(sum(i.risk_level) FILTER ( WHERE ti.indicator_value > 0 ), 0)   AS risk_level\n" +
            "                           from tender_indicator ti\n" +
            "                                    join indicator i on ti.indicator_id = i.id\n" +
            "                           where ti.date > ?\n" +
            "                           group by ti.tender_id)\n" +
            "select t.tender_number,\n" +
            "       t.outer_id,\n" +
            "       t.status_details,\n" +
            "       t.date_published :: date,\n" +
            "       t.procurement_method_details                                    procurement_method_details,\n" +
            "       t.amount :: bigint,\n" +
            "       p.outer_id                                                      buyer_id,\n" +
            "       p.identifier_legal_name                                         buyer_name,\n" +
            "       p.region                                                        buyer_region,\n" +
            "       (SELECT string_agg(DISTINCT SUBSTRING(cpv, 1, 2), ',')\n" +
            "        FROM tender_cpv_list\n" +
            "        WHERE tender_id = t.id)                                        okgz_list,\n" +
            "       (SELECT string_agg(DISTINCT cpv, ',')\n" +
            "        FROM tender_cpv_list\n" +
            "        WHERE tender_id = t.id)                                        cpv_list,\n" +
            "       (SELECT exists(SELECT * FROM complaint WHERE tender_id = t.id)) has_complaints,\n" +
            "       ti.indicators_with_risk,\n" +
            "       ti.indicators_without_risk,\n" +
            "       ti.indicators,\n" +
            "       (SELECT level\n" +
            "        FROM tender_risk_level_range\n" +
            "        WHERE procurement_method = t.procurement_method_details\n" +
            "          AND ti.risk_level\n" +
            "            BETWEEN left_bound AND right_bound) AS                     risk_level\n" +
            "from tender t\n" +
            "         join tender_indicators ti on t.id = ti.tender_id\n" +
            "         join party p on t.buyer_id = p.id\n" +
            "WHERE t.bad_quality IS FALSE\n" +
            "ORDER BY date_published, t.id\n" +
            "LIMIT ?\n" +
            "OFFSET\n" +
            "?";

    private static final String COUNT_QUERY = "select count(id)                as procedures_count,\n" +
            "       sum(amount)              as procedures_amount,\n" +
            "       count(distinct buyer_id) as buyers_count\n" +
            "from tender;";

    private static final String AMOUNT_BY_MONTH_QUERY = "select sum(amount)\n" +
            "from tender\n" +
            "where date_published >= date_trunc('month', now() - interval '1 year')\n" +
            "  and date_published < date_trunc('month', now())\n" +
            "group by date_trunc('month', date_published)\n" +
            "order by date_trunc('month', date_published);";

    private static final String COUNT_BY_MONTH_QUERY = "select count(id)\n" +
            "from tender\n" +
            "where date_published >= date_trunc('month', now() - interval '1 year')\n" +
            "  and date_published < date_trunc('month', now())\n" +
            "group by date_trunc('month', date_published)\n" +
            "order by date_trunc('month', date_published);";

    public TenderDataService(JdbcTemplate template) {
        this.template = template;
    }

    public List<TenderData> getTenderData(LocalDate startDate, long size, long offset) {
        return template.query(QUERY, new BeanPropertyRowMapper<>(TenderData.class), startDate, size, offset);
    }

    public BaseEntitiesCountData getBaseEntityCountData() {
        return template.queryForObject(COUNT_QUERY, new BeanPropertyRowMapper<>(BaseEntitiesCountData.class));
    }

    public List<Double> getProceduresAmountByMonth() {
        return template.queryForList(AMOUNT_BY_MONTH_QUERY, Double.class);
    }

    public List<Long> getProceduresCountByMonth() {
        return template.queryForList(COUNT_BY_MONTH_QUERY, Long.class);
    }
}
