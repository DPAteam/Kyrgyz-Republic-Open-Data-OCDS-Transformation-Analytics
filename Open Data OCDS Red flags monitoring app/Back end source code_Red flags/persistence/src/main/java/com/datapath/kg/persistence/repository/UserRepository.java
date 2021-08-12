package com.datapath.kg.persistence.repository;

import com.datapath.kg.persistence.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    List<UserEntity> findAllByOrderByDateCreatedDesc();

    UserEntity findByEmail(String email);

    UserEntity findOneById(Integer id);

    @Query(nativeQuery = true, value = "select *\n" +
            "from users\n" +
            "where account_locked is true\n" +
            "  and verification_mail_sent is false\n" +
            "  and extract(days from (now() - date_created)) > 5")
    List<UserEntity> findAllNotVerifiedUsers();

    @Query(nativeQuery = true, value = "select *\n" +
            "from users u\n" +
            "         join user_permission up on u.id = up.user_id\n" +
            "where up.permission_id = 1")
    List<UserEntity> findAdmins();
}
