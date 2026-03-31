package com.annapurna.in.controller;

import com.annapurna.in.dto.*;
import com.annapurna.in.service.InfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class InfoController {

    private final InfoService infoService;

    @GetMapping("/api/faq")
    public ResponseEntity<ApiResponse<List<FaqDTO>>> getFaqs() {
        return ResponseEntity.ok(ApiResponse.success("FAQs fetched", infoService.getFaqs()));
    }

    @GetMapping("/api/contact")
    public ResponseEntity<ApiResponse<List<ContactDTO>>> getContactInfo() {
        return ResponseEntity.ok(ApiResponse.success("Contact info fetched", infoService.getContactInfo()));
    }

    @GetMapping("/api/privacy")
    public ResponseEntity<ApiResponse<String>> getPrivacyPolicy() {
        return ResponseEntity.ok(ApiResponse.success("Privacy policy fetched", infoService.getPrivacyPolicy()));
    }

    @PostMapping("/api/rate")
    public ResponseEntity<ApiResponse<String>> submitRating(@RequestBody RateAppRequest request) {
        return ResponseEntity.ok(infoService.submitRating(request));
    }
}