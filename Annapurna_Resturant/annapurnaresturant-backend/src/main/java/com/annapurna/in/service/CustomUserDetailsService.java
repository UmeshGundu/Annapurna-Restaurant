package com.annapurna.in.service;

import com.annapurna.in.entity.User;
import com.annapurna.in.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String mobile) throws UsernameNotFoundException {
        User user = userRepository.findByMobile(mobile)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + mobile));

        return new org.springframework.security.core.userdetails.User(
                user.getMobile(),
                user.getPassword(),
                Collections.emptyList()
        );
    }
}
