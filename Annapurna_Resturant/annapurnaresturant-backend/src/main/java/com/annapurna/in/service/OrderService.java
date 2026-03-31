package com.annapurna.in.service;

import com.annapurna.in.dto.*;
import com.annapurna.in.entity.*;
import com.annapurna.in.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
// import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderDTO placeOrder(String mobile, PlaceOrderRequest request) {
        User user = getUser(mobile);
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double subtotal = cartItems.stream()
                .mapToDouble(ci -> ci.getMenuItem().getPrice() * ci.getQuantity())
                .sum();
        double tax = subtotal * 0.1;
        double total = subtotal + tax;

        String orderId = "ANN" + String.format("%05d", (int)(Math.random() * 90000 + 10000));

        Order order = Order.builder()
                .orderId(orderId)
                .user(user)
                .subtotal(subtotal)
                .tax(tax)
                .total(total)
                .discount(0.0)
                .deliveryFee(0.0)
                .status("Placed")
                .paymentMethod(request.getPaymentMethod())
                .deliveryAddress(request.getDeliveryAddress())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .menuItem(ci.getMenuItem())
                    .quantity(ci.getQuantity())
                    .price(ci.getMenuItem().getPrice())
                    .build();
            orderItems.add(oi);
        }
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteByUser(user);

        return toDTO(saved);
    }

    public List<OrderDTO> getOrderHistory(String mobile) {
        User user = getUser(mobile);
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public OrderDTO getOrderById(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return toDTO(order);
    }

    private User getUser(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private OrderDTO toDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(oi -> new OrderItemDTO(
                        oi.getId(),
                        oi.getMenuItem().getId(),
                        oi.getMenuItem().getName(),
                        oi.getQuantity(),
                        oi.getPrice(),
                        oi.getPrice() * oi.getQuantity()
                ))
                .collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getOrderId(),
                order.getSubtotal(),
                order.getTax(),
                order.getTotal(),
                order.getDiscount(),
                order.getDeliveryFee(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getDeliveryAddress(),
                order.getCreatedAt(),
                itemDTOs
        );
    }
}
