package com.annapurna.in.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long menuItemId;
    private String name;
    private Integer quantity;
    private Double price;
    private Double total;
}
