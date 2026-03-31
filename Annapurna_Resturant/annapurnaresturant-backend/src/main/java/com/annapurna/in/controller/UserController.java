package com.annapurna.in.controller;

import com.annapurna.in.dto.*;
import com.annapurna.in.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched",
                userService.getProfile(auth.getName())));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            Authentication auth, @RequestBody UpdateProfileRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Profile updated",
                    userService.updateProfile(auth.getName(), request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
