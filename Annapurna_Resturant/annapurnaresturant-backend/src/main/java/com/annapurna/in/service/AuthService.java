package com.annapurna.in.service;

import com.annapurna.in.dto.*;
import com.annapurna.in.entity.*;
import com.annapurna.in.repository.*;
import com.annapurna.in.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpVerificationRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByMobile(request.getMobile())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getMobile());
        return new AuthResponse(token, "Login successful", user.getId(), user.getName(), user.getMobile());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getMobile());
        return new AuthResponse(token, "Registration successful", user.getId(), user.getName(), user.getMobile());
    }

    public ApiResponse<String> sendOtp(OtpRequest request) {
        // In production, integrate with SMS gateway (Twilio, MSG91, etc.)
        // For now, we use a fixed OTP "123456" for testing
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpVerification otpRecord = OtpVerification.builder()
                .mobile(request.getMobile())
                .otp(otp)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .used(false)
                .build();

        otpRepository.save(otpRecord);

        // Log OTP for testing (remove in production)
        System.out.println("OTP for " + request.getMobile() + ": " + otp);

        return ApiResponse.success("OTP sent successfully", "OTP sent to " + request.getMobile());
    }

    public ApiResponse<String> verifyOtp(OtpVerifyRequest request) {
        OtpVerification otpRecord = otpRepository
                .findTopByMobileAndUsedFalseOrderByCreatedAtDesc(request.getMobile())
                .orElseThrow(() -> new RuntimeException("No OTP found"));

        if (LocalDateTime.now().isAfter(otpRecord.getExpiresAt())) {
            throw new RuntimeException("OTP expired");
        }

        if (!otpRecord.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        otpRecord.setUsed(true);
        otpRepository.save(otpRecord);

        return ApiResponse.success("OTP verified successfully", "Verified");
    }
}
