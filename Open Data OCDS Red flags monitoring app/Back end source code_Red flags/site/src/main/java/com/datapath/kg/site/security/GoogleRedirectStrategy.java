package com.datapath.kg.site.security;

import org.springframework.security.web.RedirectStrategy;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static java.util.Objects.nonNull;

public class GoogleRedirectStrategy implements RedirectStrategy {

    private static final String JWT = "?jwt=";
    private static final String GOOGLE_REGISTRATION_SUCCEED = "?google-registration-succeed";

    @Override
    public void sendRedirect(HttpServletRequest request, HttpServletResponse response, String url) throws IOException {
        String redirectUrl = response.encodeRedirectURL(url);
        if (nonNull(request.getAttribute("jwt"))) {
            response.sendRedirect(redirectUrl + JWT + request.getAttribute("jwt"));
        } else {
            response.sendRedirect(redirectUrl + GOOGLE_REGISTRATION_SUCCEED);
        }
    }

}
