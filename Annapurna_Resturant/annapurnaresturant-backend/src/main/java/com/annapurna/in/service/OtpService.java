package com.annapurna.in.service;

import com.annapurna.in.entity.OtpVerification;
import com.annapurna.in.repository.OtpVerificationRepository;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    private final OtpVerificationRepository otpRepo;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    public OtpService(OtpVerificationRepository otpRepo) {
        this.otpRepo = otpRepo;
    }

    public String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    public void sendOtp(String mobile) {
        String otp = generateOtp();

        // Save OTP in DB
        OtpVerification otpEntity = new OtpVerification();
        otpEntity.setMobile(mobile);
        otpEntity.setOtp(otp);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepo.save(otpEntity);

        // Send SMS via Twilio
        Message.creator(
                new PhoneNumber("+91" + mobile),
                new PhoneNumber(fromNumber),
                "Your OTP is: " + otp
        ).create();
    }

    public boolean verifyOtp(String mobile, String otp) {
        OtpVerification record = otpRepo.findTopByMobileOrderByExpiryTimeDesc(mobile);

        if (record == null) return false;

        return record.getOtp().equals(otp) &&
               record.getExpiresAt().isAfter(LocalDateTime.now());
    }
}
