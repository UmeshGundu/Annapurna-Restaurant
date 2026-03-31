package com.annapurna.in.repository;

import com.annapurna.in.entity.CartItem;
import com.annapurna.in.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndMenuItemId(User user, Long menuItemId);
    void deleteByUser(User user);
    void deleteByUserAndMenuItemId(User user, Long menuItemId);
}
