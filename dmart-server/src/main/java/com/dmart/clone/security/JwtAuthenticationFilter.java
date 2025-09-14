package com.dmart.clone.security;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dmart.clone.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JwtAuthenticationFilter - Extracts Bearer token - Validates token against
 * JwtUtil and UserDetails - Populates SecurityContext with authorities from
 * UserDetails - Writes structured JSON error responses on failure (401/403)
 */

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService userDetailsService;

	@Autowired
	public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
		this.jwtUtil = jwtUtil;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		final String authHeader = request.getHeader("Authorization");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			log.warn("No JWT token found in Authorization header");
			filterChain.doFilter(request, response);
			return;
		}

		final String token = authHeader.substring(7);
		log.info("Extracted JWT: {}", token);

		try {
			String username = jwtUtil.extractUsername(token);
			log.info("Username extracted from token: {}", username);

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				log.info("Loaded user from DB: {}", userDetails.getUsername());

				if (jwtUtil.validateToken(token, userDetails)) {
					log.info("Token is valid, setting authentication");

					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
							null, userDetails.getAuthorities());
					authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

					SecurityContextHolder.getContext().setAuthentication(authToken);
				} else {
					log.warn("Token validation failed for username: {}", username);
				}
			}
		} catch (Exception e) {
			log.error("JWT processing failed: {}", e.getMessage(), e);
		}

		filterChain.doFilter(request, response);
	}
}