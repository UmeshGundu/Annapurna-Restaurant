package com.annapurna.in.service;

import com.annapurna.in.dto.*;
import com.annapurna.in.entity.*;
import com.annapurna.in.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressDTO> getAddresses(String mobile) {
        User user = getUser(mobile);
        return addressRepository.findByUser(user)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public AddressDTO addAddress(String mobile, AddressRequest request) {
        User user = getUser(mobile);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultForUser(user);
        }

        Address address = Address.builder()
                .user(user)
                .tag(request.getTag())
                .tagIcon(request.getTagIcon())
                .name(request.getName())
                .line1(request.getLine1())
                .line2(request.getLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .phone(request.getPhone())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();

        return toDTO(addressRepository.save(address));
    }

    @Transactional
    public AddressDTO updateAddress(String mobile, Long addressId, AddressRequest request) {
        User user = getUser(mobile);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.clearDefaultForUser(user);
        }

        address.setTag(request.getTag());
        address.setTagIcon(request.getTagIcon());
        address.setName(request.getName());
        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setPhone(request.getPhone());
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }

        return toDTO(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(String mobile, Long addressId) {
        User user = getUser(mobile);
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        addressRepository.delete(address);
    }

    @Transactional
    public List<AddressDTO> setDefault(String mobile, Long addressId) {
        User user = getUser(mobile);
        addressRepository.clearDefaultForUser(user);

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        address.setIsDefault(true);
        addressRepository.save(address);

        return getAddresses(mobile);
    }

    private User getUser(String mobile) {
        return userRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private AddressDTO toDTO(Address a) {
        return new AddressDTO(
                a.getId(), a.getTag(), a.getTagIcon(), a.getName(),
                a.getLine1(), a.getLine2(), a.getCity(), a.getState(),
                a.getPincode(), a.getPhone(), a.getIsDefault()
        );
    }
}
