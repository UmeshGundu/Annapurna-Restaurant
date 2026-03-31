package com.annapurna.in.service;

import com.annapurna.in.dto.MenuItemDTO;
import com.annapurna.in.entity.MenuItem;
import com.annapurna.in.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItemDTO> getAllItems() {
        return menuItemRepository.findByAvailableTrue()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MenuItemDTO> getByCategory(String category) {
        return menuItemRepository.findByCategoryAndAvailableTrue(category)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<MenuItemDTO> search(String query) {
        return menuItemRepository.findByNameContainingIgnoreCaseAndAvailableTrue(query)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MenuItemDTO getById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return toDTO(item);
    }

    private MenuItemDTO toDTO(MenuItem item) {
        return new MenuItemDTO(
                item.getId(),
                item.getName(),
                item.getPrice(),
                item.getCategory(),
                item.getDescription(),
                item.getImageUrl(),
                item.getAvailable()
        );
    }
}
