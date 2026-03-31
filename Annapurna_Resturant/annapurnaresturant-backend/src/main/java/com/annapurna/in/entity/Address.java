package com.annapurna.in.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String tag;

    @Column(name = "tag_icon")
    private String tagIcon;

    private String name;

    private String line1;

    private String line2;

    private String city;

    private String state;

    private String pincode;

    private String phone;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;
}
