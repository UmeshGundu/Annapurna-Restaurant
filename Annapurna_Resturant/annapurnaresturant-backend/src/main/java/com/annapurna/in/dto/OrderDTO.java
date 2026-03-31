package com.annapurna.in.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderId;
    private Double subtotal;
    private Double tax;
    private Double total;
    private Double discount;
    private Double deliveryFee;
    private String status;
    private String paymentMethod;
    private String deliveryAddress;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
}
