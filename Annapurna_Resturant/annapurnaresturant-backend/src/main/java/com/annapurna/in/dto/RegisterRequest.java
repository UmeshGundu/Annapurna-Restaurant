package com.annapurna.in.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String mobile;
    private String password;
}
