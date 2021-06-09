package com.datapath.kg.site.controller;

import com.datapath.kg.site.dto.ApplicationUser;
import com.datapath.kg.site.request.user.ResetPasswordRequest;
import com.datapath.kg.site.request.user.ResetPasswordSendRequest;
import com.datapath.kg.site.request.user.UpdateUserRequest;
import com.datapath.kg.site.services.user.UserWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("user")
public class UserManagementController {

    private final UserWebService userService;

    @Autowired
    public UserManagementController(UserWebService userService) {
        this.userService = userService;
    }

    @GetMapping("users")
    @PreAuthorize("hasAnyAuthority('admin.base')")
    public List<ApplicationUser> list() {
        return userService.list();
    }

    @DeleteMapping("remove/{id}")
    @PreAuthorize("hasAnyAuthority('admin.base')")
    public void delete(@PathVariable Integer id) {
        userService.delete(id);
    }

    @PutMapping("update")
    @PreAuthorize("hasAnyAuthority('admin.base')")
    public void update(@Valid @RequestBody UpdateUserRequest request) {
        userService.update(request);
    }

    @PutMapping("register")
    public ApplicationUser create(@Valid @RequestBody ApplicationUser appUser) {
        return userService.create(appUser);
    }

    @PostMapping("password/reset/mail")
    public void sendMailResetPassword(@Valid @RequestBody ResetPasswordSendRequest request) {
        userService.sendMailForResetPassword(request);
    }

    @GetMapping("password/reset/check")
    public void checkResetPassword(@RequestParam String token) {
        userService.checkTokenForResetPassword(token);
    }

    @PostMapping("password/reset/save")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
    }
}