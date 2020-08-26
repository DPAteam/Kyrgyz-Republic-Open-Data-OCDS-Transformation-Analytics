package com.datapath.kg.site.request;

import lombok.Data;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class BucketRequest {

    @NotNull
    private List<String> tenderIds;

    @AssertTrue(message = "Max tenders count 1000")
    public boolean isValid() {
        return tenderIds.size() <= 1000;
    }
}
