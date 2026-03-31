package com.annapurna.in.controller;

import com.annapurna.in.dto.*;
import com.annapurna.in.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItemDTO>>> getWishlist(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Wishlist fetched",
                wishlistService.getWishlist(auth.getName())));
    }

    @PostMapping("/toggle/{menuItemId}")
    public ResponseEntity<ApiResponse<List<WishlistItemDTO>>> toggleWishlist(
            Authentication auth, @PathVariable Long menuItemId) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Wishlist updated",
                    wishlistService.toggleWishlist(auth.getName(), menuItemId)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/check/{menuItemId}")
    public ResponseEntity<ApiResponse<Boolean>> isWishlisted(
            Authentication auth, @PathVariable Long menuItemId) {
        return ResponseEntity.ok(ApiResponse.success("Checked",
                wishlistService.isWishlisted(auth.getName(), menuItemId)));
    }
}
