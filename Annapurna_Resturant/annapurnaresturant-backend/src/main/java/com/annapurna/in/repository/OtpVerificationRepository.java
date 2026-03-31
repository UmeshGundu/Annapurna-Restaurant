package com.annapurna.in.repository;

import com.annapurna.in.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByMobileAndUsedFalseOrderByCreatedAtDesc(String mobile);

    OtpVerification findTopByMobileOrderByExpiryTimeDesc(String mobile);
}
