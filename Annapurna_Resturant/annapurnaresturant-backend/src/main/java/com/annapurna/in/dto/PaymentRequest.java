package com.annapurna.in.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String paymentMethod;
    private String upiId;
    private String cardNumber;
    private String cardName;
    private String expiry;
    private Double amount;
    private Long orderId;
}
