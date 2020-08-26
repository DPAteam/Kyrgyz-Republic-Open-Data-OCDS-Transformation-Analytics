package com.dpa.kg.portal.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthRequirements {

    private String date;
    private List<StringLong> qualificationRequirements;

}
