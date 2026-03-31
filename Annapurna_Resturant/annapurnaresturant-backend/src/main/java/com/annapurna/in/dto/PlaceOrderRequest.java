package com.annapurna.in.dto;

import lombok.Data;

@Data
public class PlaceOrderRequest {
    private String paymentMethod;
    private String deliveryAddress;
    private Double total;
}
