package com.annapurna.in.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Long menuItemId;
    private Integer quantity;
}
