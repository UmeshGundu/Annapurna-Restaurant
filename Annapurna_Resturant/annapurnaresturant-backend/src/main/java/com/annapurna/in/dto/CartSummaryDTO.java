package com.annapurna.in.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartSummaryDTO {
    private List<CartItemDTO> items;
    private Double subtotal;
    private Double tax;
    private Double total;
    private Integer totalItems;
}
