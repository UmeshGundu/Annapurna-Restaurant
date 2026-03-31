package com.annapurna.in.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Long id;
    private String tag;
    private String tagIcon;
    private String name;
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private Boolean isDefault;
}
