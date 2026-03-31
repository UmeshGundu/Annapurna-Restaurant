package com.annapurna.in.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String name;
    private String mobile;
    private String email;
    private String dob;
    private String gender;
    private int orderCount;
    private int wishlistCount;
}
