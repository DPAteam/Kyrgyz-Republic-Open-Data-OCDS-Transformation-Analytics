package com.datapath.kg.elasticsearchintegration.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@ApiModel(description = "Class representing filtering model")
public class FilterQuery {

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date startDate;

    @NotNull
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date endDate;

    @ApiModelProperty(value = "Page number of returned elements")
    private int page = 0;

    @ApiModelProperty(value = "Quantity of returned elements")
    private int size = 10;

    private String procedureId;
    private List<Integer> riskedIndicators = new ArrayList<>();
    private Boolean withRisk;
    private List<Integer> riskLevels = new ArrayList<>();
    private List<String> buyerRegions = new ArrayList<>();
    private List<String> itemCpv2 = new ArrayList<>();
    private List<String> itemCpv = new ArrayList<>();
    private List<String> procurementMethodDetails = new ArrayList<>();
    private List<String> buyers = new ArrayList<>();
    private List<String> statusDetails = new ArrayList<>();
    private Boolean hasComplaints;
    private Long minExpectedValue;
    private Long maxExpectedValue;
    @ApiModelProperty(value = "Search field name for getting available data for filter", allowableValues = "spvNames,spv2Names,procuringEntities")
    private String searchField;
    @ApiModelProperty(value = "Value for search in search field")
    private String searchValue;
    @ApiModelProperty(value = "Number of dropdown elements. Default = 10")
    private int searchCount;

    @ApiModelProperty(value = "field used for sorting (from procedure's entity)")
    private String sortField;
    @ApiModelProperty(value = "Sort direction: ASC, DESC")
    private String sortDirection;
}