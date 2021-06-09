package com.datapath.kg.persistence.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "users")
@Data
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String email;
    private String password;
    private String name;
    private Boolean accountLocked;
    private Boolean verificationMailSent;
    @CreationTimestamp
    private LocalDateTime dateCreated;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_permission",
            joinColumns = {@JoinColumn(name = "user_id")},
            inverseJoinColumns = {@JoinColumn(name = "permission_id")},
            uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "permission_id"}))
    private List<PermissionEntity> permissions;
}
