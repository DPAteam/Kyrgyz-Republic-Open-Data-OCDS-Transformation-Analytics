package com.datapath.kg.site.security;

import org.springframework.security.web.RedirectStrategy;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class GoogleRedirectStrategy implements RedirectStrategy {

    @Override
    public void sendRedirect(HttpServletRequest request, HttpServletResponse response, String url) throws IOException {
        String redirectUrl = response.encodeRedirectURL(url);
        response.sendRedirect(redirectUrl + "?jwt=" + request.getAttribute("jwt"));
    }

}
