package com.annapurna.in.service;

import com.annapurna.in.dto.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InfoService {

    public List<FaqDTO> getFaqs() {
        return List.of(
                new FaqDTO("How to place an order?",
                        "Browse items → Add to cart → Checkout → Confirm order."),
                new FaqDTO("How to track my order?",
                        "Go to Profile → Order History → Select order."),
                new FaqDTO("Payment issues?",
                        "Try again or contact support at support@annapurna.com."),
                new FaqDTO("Can I cancel my order?",
                        "Orders can be cancelled within 5 minutes of placing."),
                new FaqDTO("What are the delivery charges?",
                        "Free delivery on all orders above ₹100.")
        );
    }

    public List<ContactDTO> getContactInfo() {
        return List.of(
                new ContactDTO("call-outline", "Phone", "+91 98765 43210"),
                new ContactDTO("mail-outline", "Email", "support@annapurna.com"),
                new ContactDTO("location-outline", "Location", "Hyderabad, India")
        );
    }

    public String getPrivacyPolicy() {
        return "Annapurna Restaurant Privacy Policy: We respect your privacy. Your personal data is " +
               "securely stored and never shared with third parties. We collect only essential data " +
               "required for order processing and improving your experience.";
    }

    public ApiResponse<String> submitRating(RateAppRequest request) {
        // In production: save to database
        System.out.println("App rating received: " + request.getRating() + " stars. Review: " + request.getReview());
        return ApiResponse.success("Thank you for rating us!", "Rating submitted");
    }
}
