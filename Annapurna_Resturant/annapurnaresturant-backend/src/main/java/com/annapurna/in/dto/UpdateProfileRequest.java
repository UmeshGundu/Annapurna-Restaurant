package com.annapurna.in.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String email;
    private String dob;
    private String gender;
    private String phone;
    
}
