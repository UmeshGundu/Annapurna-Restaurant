package com.annapurna.in.service;

import com.annapurna.in.dto.*;
import com.annapurna.in.entity.User;
import com.annapurna.in.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final WishlistItemRepository wishlistRepository;

    public UserProfileDTO getProfile(String mobile) {
        User user = getUser(mobile);
        int orderCount = orderRepository.findByUserOrderByCreatedAtDesc(user).size();
        int wishlistCount = wishlistRepository.findByUser(user).size();

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getMobile(),
                user.getEmail(),
                user.getDob() != null ? user.getDob().toString() : null,
                user.getGender(),
                orderCount,
                wishlistCount);
    }

    public UserProfileDTO updateProfile(String mobile, UpdateProfileRequest request) {
        User user = getUser(mobile);

        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getDob() != null && !request.getDob().isEmpty()) {
            try {
                user.setDob(LocalDate.parse(request.getDob())); // ISO
            } catch (Exception e) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                user.setDob(LocalDate.parse(request.getDob(), formatter));
            }
        }

        userRepository.save(user);
        return getProfile(mobile);
    }

    private User getUser(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
