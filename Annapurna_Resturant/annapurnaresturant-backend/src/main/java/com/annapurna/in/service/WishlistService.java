package com.annapurna.in.service;

import com.annapurna.in.dto.WishlistItemDTO;
import com.annapurna.in.entity.*;
import com.annapurna.in.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public List<WishlistItemDTO> getWishlist(String mobile) {
        User user = getUser(mobile);
        return wishlistRepository.findByUser(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public List<WishlistItemDTO> toggleWishlist(String mobile, Long menuItemId) {
        User user = getUser(mobile);

        boolean exists = wishlistRepository.existsByUserAndMenuItemId(user, menuItemId);

        if (exists) {
            // Flush to ensure the delete actually commits
            wishlistRepository.deleteByUserAndMenuItemId(user, menuItemId);
            wishlistRepository.flush();
        } else {
            MenuItem menuItem = menuItemRepository.findById(menuItemId)
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));
            WishlistItem item = WishlistItem.builder()
                    .user(user)
                    .menuItem(menuItem)
                    .build();
            wishlistRepository.save(item);
        }

        return getWishlist(mobile);
    }

    public boolean isWishlisted(String mobile, Long menuItemId) {
        User user = getUser(mobile);
        return wishlistRepository.existsByUserAndMenuItemId(user, menuItemId);
    }

    private User getUser(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private WishlistItemDTO toDTO(WishlistItem item) {
        return new WishlistItemDTO(
                item.getId(),
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getMenuItem().getPrice(),
                item.getMenuItem().getCategory(),
                item.getMenuItem().getImageUrl(),
                item.getMenuItem().getDescription());
    }
}
