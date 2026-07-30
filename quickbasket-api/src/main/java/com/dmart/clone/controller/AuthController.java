package com.dmart.clone.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.config.CookieUtil;
import com.dmart.clone.dto.JwtResponse;
import com.dmart.clone.dto.LoginRequest;
import com.dmart.clone.dto.RefreshTokenRequest;
import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.security.JwtUtil;
import com.dmart.clone.service.AuthServiceImpl;
import com.dmart.clone.service.TokenBlacklistService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthServiceImpl authService;
    private final CookieUtil cookieUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthServiceImpl authService, CookieUtil cookieUtil,
                          TokenBlacklistService tokenBlacklistService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.cookieUtil = cookieUtil;
        this.tokenBlacklistService = tokenBlacklistService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest req) {
        JwtResponse response = authService.login(req);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(response.token()).toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.createRefreshTokenCookie(response.refreshToken()).toString())
                .body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterRequest req) {
        authService.registerUser(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody(required = false) RefreshTokenRequest req,
                                                     HttpServletRequest request) {
        // Try cookie first, then request body
        String refreshTokenStr = cookieUtil.getRefreshTokenFromCookies(request);
        if (refreshTokenStr == null && req != null) {
            refreshTokenStr = req.refreshToken();
        }
        if (refreshTokenStr == null) {
            throw new RuntimeException("No refresh token provided");
        }

        JwtResponse response = authService.refreshAccessToken(refreshTokenStr);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.createAccessTokenCookie(response.token()).toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody(required = false) RefreshTokenRequest req,
                                        HttpServletRequest request) {
        // Blacklist the access token
        String accessToken = cookieUtil.getAccessTokenFromCookies(request);
        if (accessToken == null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                accessToken = authHeader.substring(7);
            }
        }
        if (accessToken != null) {
            try {
                long expiry = jwtUtil.extractExpiration(accessToken).getTime();
                tokenBlacklistService.blacklist(accessToken, expiry);
            } catch (Exception e) {
                // Token may already be expired — that's fine
            }
        }

        // Revoke refresh token
        String refreshTokenStr = cookieUtil.getRefreshTokenFromCookies(request);
        if (refreshTokenStr == null && req != null) {
            refreshTokenStr = req.refreshToken();
        }
        if (refreshTokenStr != null) {
            authService.logout(refreshTokenStr);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.deleteAccessTokenCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.deleteRefreshTokenCookie().toString())
                .build();
    }
}
