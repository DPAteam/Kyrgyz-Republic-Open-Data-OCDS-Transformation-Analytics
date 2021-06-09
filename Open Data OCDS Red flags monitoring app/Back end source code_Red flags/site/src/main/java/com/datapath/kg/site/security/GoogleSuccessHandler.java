package com.datapath.kg.site.security;

import com.datapath.kg.persistence.entity.UserEntity;
import com.datapath.kg.site.dto.ApplicationUser;
import com.datapath.kg.site.services.user.UserWebService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

import static com.datapath.kg.site.security.SecurityConstants.SECRET_KEY;
import static java.util.stream.Collectors.toList;

@Component
@AllArgsConstructor
public class GoogleSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private UserWebService userWebService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {

        String email = ((DefaultOidcUser) authentication.getPrincipal()).getEmail();
        String fullName = ((DefaultOidcUser) authentication.getPrincipal()).getFullName();
        register(email, fullName);

        UserEntity user = userWebService.findByEmail(email);

        if (!user.getAccountLocked()) {
            String token = Jwts.builder()
                    .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                    .setSubject(user.getEmail())
                    .setId(user.getId().toString())
                    .claim("permissions", authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(toList()))
                    .compact();

            UsersStorageService.addUser(user.getId());

            request.setAttribute("jwt", token);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        super.onAuthenticationSuccess(request, response, authentication);
    }

    private void register(String email, String fullName) {
        boolean exists = userWebService.exists(email);
        if (!exists) {
            ApplicationUser newUser = new ApplicationUser();
            newUser.setEmail(email);
            newUser.setName(fullName);
            newUser.setPassword(UUID.randomUUID().toString());
            userWebService.create(newUser);
        }
    }

}
