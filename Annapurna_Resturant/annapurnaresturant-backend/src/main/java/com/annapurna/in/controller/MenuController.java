package com.annapurna.in.controller;

import com.annapurna.in.dto.*;
import com.annapurna.in.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getAllItems() {
        return ResponseEntity.ok(ApiResponse.success("Menu fetched", menuService.getAllItems()));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success("Category fetched", menuService.getByCategory(category)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MenuItemDTO>>> search(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.success("Search results", menuService.search(q)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemDTO>> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Item fetched", menuService.getById(id)));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
