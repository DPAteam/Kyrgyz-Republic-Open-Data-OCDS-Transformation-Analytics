package com.datapath.kg.persistence.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import java.time.LocalDate;

@Data
@Entity(name = "bucket")
@NoArgsConstructor
public class BucketEntity {

    @EmbeddedId
    private BucketId id;
    private LocalDate addedDate;

    public BucketEntity(String tenderId, Integer userId) {
        this.addedDate = LocalDate.now();
        this.id = new BucketId(userId, tenderId);
    }
}
