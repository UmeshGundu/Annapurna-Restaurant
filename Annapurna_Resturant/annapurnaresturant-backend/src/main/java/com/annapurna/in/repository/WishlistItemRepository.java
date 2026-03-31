package com.annapurna.in.repository;

import com.annapurna.in.entity.WishlistItem;
import com.annapurna.in.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);

    Optional<WishlistItem> findByUserAndMenuItemId(User user, Long menuItemId);

    boolean existsByUserAndMenuItemId(User user, Long menuItemId);

    // ADD @Modifying here — this is the root cause of delete not working in DB
    @Modifying
    @Query("DELETE FROM WishlistItem w WHERE w.user = :user AND w.menuItem.id = :menuItemId")
    void deleteByUserAndMenuItemId(@Param("user") User user, @Param("menuItemId") Long menuItemId);
}
