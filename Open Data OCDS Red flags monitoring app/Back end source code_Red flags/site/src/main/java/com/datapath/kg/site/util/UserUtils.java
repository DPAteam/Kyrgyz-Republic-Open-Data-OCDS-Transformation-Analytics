package com.datapath.kg.site.util;

import com.datapath.kg.persistence.entity.UserEntity;
import com.datapath.kg.site.dto.ApplicationUser;
import com.datapath.kg.site.security.UserAuthInfo;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;

public class UserUtils {

    public static ApplicationUser convertToDTO(UserEntity user) {
        ApplicationUser applicationUser = new ApplicationUser();
        BeanUtils.copyProperties(user, applicationUser);
        applicationUser.setPassword(null);
        return applicationUser;
    }

    public static Integer getUserId() {
        return Integer.parseInt(
                ((UserAuthInfo) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId()
        );
    }
}
