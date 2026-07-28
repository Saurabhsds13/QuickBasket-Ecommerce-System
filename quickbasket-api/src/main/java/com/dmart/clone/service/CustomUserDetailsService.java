package com.dmart.clone.service;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dmart.clone.model.User;
import com.dmart.clone.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		System.out.println("Loaded user " + user.getUsername() + " with authorities: "
				+ List.of(new SimpleGrantedAuthority(user.getRole().toSpringRole())));

		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				!user.isBlocked(), // enabled
				true, // accountNonExpired
				true, // credentialsNonExpired
				true, // accountNonLocked
				List.of(new SimpleGrantedAuthority(user.getRole().toSpringRole())));
	}
}