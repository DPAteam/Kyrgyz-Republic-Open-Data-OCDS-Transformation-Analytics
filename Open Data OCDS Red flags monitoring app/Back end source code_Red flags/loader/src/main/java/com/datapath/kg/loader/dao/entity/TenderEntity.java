package com.datapath.kg.loader.dao.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

@Data
@Entity(name = "tender")
@EqualsAndHashCode(of = "id")
public class TenderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer outerId;
    private Integer buyerId;
    private String status;
    private String statusDetails;
    private LocalDateTime date;
    private LocalDateTime datePublished;
    private LocalDateTime periodStartDate;
    private LocalDateTime periodEndDate;
    private String procurementMethodRationale;
    private String procurementMethodDetails;
    private String procurementMethod;
    private Double amount;
    private String currency;
    private String tenderNumber;
    private boolean badQuality;

    @OneToOne(cascade = ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ocid")
    private ReleaseEntity release;

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<LotEntity> lots = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<ItemEntity> items = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<AwardEntity> awards = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<QualificationRequirementEntity> qualificationRequirements = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<EnquiryEntity> enquiries = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<RelatedProcessEntity> relatedProcesses = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<BidEntity> bids = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<ComplaintEntity> complaints = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<ContractEntity> contracts = new HashSet<>();

    @OneToOne(mappedBy = "tender", cascade = ALL)
    private ConditionOfContractEntity conditionOfContract;

    @ManyToMany
    @JoinTable(name = "tender_supplier",
            joinColumns = @JoinColumn(name = "tender_id"),
            inverseJoinColumns = @JoinColumn(name = "party_id")
    )
    private Set<PartyEntity> suppliers = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "tender_tenderer",
            joinColumns = @JoinColumn(name = "tender_id"),
            inverseJoinColumns = @JoinColumn(name = "party_id")
    )
    private Set<PartyEntity> tenderers = new HashSet<>();

    @OneToMany(mappedBy = "tender", cascade = ALL)
    private Set<DocumentEntity> documents = new HashSet<>();
}