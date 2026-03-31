package com.annapurna.in.service;

import com.annapurna.in.dto.*;
import com.annapurna.in.entity.*;
import com.annapurna.in.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public CartSummaryDTO getCart(String mobile) {
        User user = getUser(mobile);
        List<CartItem> items = cartItemRepository.findByUser(user);
        List<CartItemDTO> dtos = items.stream().map(this::toDTO).collect(Collectors.toList());

        double subtotal = dtos.stream().mapToDouble(CartItemDTO::getTotal).sum();
        double tax = subtotal * 0.1;
        double total = subtotal + tax;
        int totalItems = dtos.stream().mapToInt(CartItemDTO::getQuantity).sum();

        return new CartSummaryDTO(dtos, subtotal, tax, total, totalItems);
    }

    @Transactional
    public CartSummaryDTO addToCart(String mobile, CartItemRequest request) {
        User user = getUser(mobile);
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        Optional<CartItem> existing = cartItemRepository.findByUserAndMenuItemId(user, menuItem.getId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + (request.getQuantity() != null ? request.getQuantity() : 1));
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(user)
                    .menuItem(menuItem)
                    .quantity(request.getQuantity() != null ? request.getQuantity() : 1)
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(mobile);
    }

    @Transactional
    public CartSummaryDTO removeFromCart(String mobile, Long menuItemId) {
        User user = getUser(mobile);
        Optional<CartItem> existing = cartItemRepository.findByUserAndMenuItemId(user, menuItemId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            if (item.getQuantity() <= 1) {
                cartItemRepository.delete(item);
            } else {
                item.setQuantity(item.getQuantity() - 1);
                cartItemRepository.save(item);
            }
        }

        return getCart(mobile);
    }

    @Transactional
    public void clearCart(String mobile) {
        User user = getUser(mobile);
        cartItemRepository.deleteByUser(user);
    }

    private User getUser(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CartItemDTO toDTO(CartItem item) {
        return new CartItemDTO(
                item.getId(),
                item.getMenuItem().getId(),
                item.getMenuItem().getName(),
                item.getMenuItem().getPrice(),
                item.getMenuItem().getCategory(),
                item.getMenuItem().getImageUrl(),
                item.getQuantity(),
                item.getMenuItem().getPrice() * item.getQuantity()
        );
    }
}
