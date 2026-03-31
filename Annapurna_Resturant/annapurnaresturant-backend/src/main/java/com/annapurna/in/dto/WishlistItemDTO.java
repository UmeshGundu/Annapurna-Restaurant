package com.annapurna.in.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistItemDTO {
    private Long id;
    private Long menuItemId;
    private String name;
    private Double price;
    private String category;
    private String imageUrl;
    private String description;
}
