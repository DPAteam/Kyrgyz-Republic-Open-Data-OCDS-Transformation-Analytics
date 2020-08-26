package com.datapath.kg.common.containers;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(exclude = {"id", "date"})
@Document(collection = "tendering")
public class TenderingRelease {

    @Indexed(unique = true)
    private String ocid;
    private String id;
    @Indexed
    private OffsetDateTime date;
    private String initiationType;
    private List<String> tag;
    private List<Party> parties;
    private Tender tender;
    private List<Complaint> complaints;
    private Bids bids;
    private List<Contract> contracts;
    private List<Award> awards;
    private List<RelatedProcess> relatedProcesses;
    private TenderingPlanning planning;

}
