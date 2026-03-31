package com.annapurna.in.controller;

import com.annapurna.in.dto.*;
import com.annapurna.in.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDTO>>> getAddresses(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Addresses fetched",
                addressService.getAddresses(auth.getName())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AddressDTO>> addAddress(
            Authentication auth, @RequestBody AddressRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Address added",
                    addressService.addAddress(auth.getName(), request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressDTO>> updateAddress(
            Authentication auth, @PathVariable Long addressId, @RequestBody AddressRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Address updated",
                    addressService.updateAddress(auth.getName(), addressId, request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(
            Authentication auth, @PathVariable Long addressId) {
        try {
            addressService.deleteAddress(auth.getName(), addressId);
            return ResponseEntity.ok(ApiResponse.success("Address deleted", "Done"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{addressId}/set-default")
    public ResponseEntity<ApiResponse<List<AddressDTO>>> setDefault(
            Authentication auth, @PathVariable Long addressId) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Default set",
                    addressService.setDefault(auth.getName(), addressId)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
