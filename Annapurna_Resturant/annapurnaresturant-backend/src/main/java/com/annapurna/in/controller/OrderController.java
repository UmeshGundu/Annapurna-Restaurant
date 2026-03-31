package com.annapurna.in.controller;

import com.annapurna.in.dto.*;
import com.annapurna.in.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<ApiResponse<OrderDTO>> placeOrder(
            Authentication auth, @RequestBody PlaceOrderRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Order placed",
                    orderService.placeOrder(auth.getName(), request)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getHistory(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Order history fetched",
                orderService.getOrderHistory(auth.getName())));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrder(@PathVariable String orderId) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Order fetched",
                    orderService.getOrderById(orderId)));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
