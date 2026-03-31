package com.annapurna.in.service;

import com.annapurna.in.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    public PaymentResponse processPayment(PaymentRequest request) {
        // Simulate payment processing
        // In production: integrate Razorpay, PayU, Stripe, etc.

        boolean success = true;
        String transactionId = "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        if (success) {
            return new PaymentResponse(true, transactionId,
                    "Payment successful via " + request.getPaymentMethod(),
                    request.getOrderId() != null ? request.getOrderId().toString() : null);
        } else {
            return new PaymentResponse(false, null, "Payment failed", null);
        }
    }
}
