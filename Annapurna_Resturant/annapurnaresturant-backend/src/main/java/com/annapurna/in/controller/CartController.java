package com.annapurna.in.controller;

import com.annapurna.in.dto.*;
import com.annapurna.in.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartSummaryDTO>> getCart(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Cart fetched",
                cartService.getCart(auth.getName())));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartSummaryDTO>> addToCart(
            Authentication auth, @RequestBody CartItemRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Item added",
                    cartService.addToCart(auth.getName(), request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/remove/{menuItemId}")
    public ResponseEntity<ApiResponse<CartSummaryDTO>> removeFromCart(
            Authentication auth, @PathVariable Long menuItemId) {
        return ResponseEntity.ok(ApiResponse.success("Item removed",
                cartService.removeFromCart(auth.getName(), menuItemId)));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart(Authentication auth) {
        cartService.clearCart(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", "Done"));
    }
}
