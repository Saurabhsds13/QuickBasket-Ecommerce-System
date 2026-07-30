package com.dmart.clone.config;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Simple in-memory rate limiter per IP.
 * For distributed systems, replace with Redis-backed implementation.
 */
@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    @Value("${app.ratelimit.auth.requests-per-minute:10}")
    private int authLimit;

    @Value("${app.ratelimit.api.requests-per-minute:60}")
    private int apiLimit;

    // IP -> (window start, count)
    private final Map<String, RateWindow> authWindows = new ConcurrentHashMap<>();
    private final Map<String, RateWindow> apiWindows = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String ip = getClientIp(request);
        String path = request.getRequestURI();

        // Auth endpoints get stricter limits
        if (path.startsWith("/api/auth/")) {
            if (!isAllowed(authWindows, ip, authLimit)) {
                response.setContentType("application/json");
                response.setStatus(429);
                response.getWriter().write("{\"status\":429,\"message\":\"Too many requests. Please try again later.\"}");
                return;
            }
        } else if (path.startsWith("/api/")) {
            if (!isAllowed(apiWindows, ip, apiLimit)) {
                response.setContentType("application/json");
                response.setStatus(429);
                response.getWriter().write("{\"status\":429,\"message\":\"Rate limit exceeded. Please slow down.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(Map<String, RateWindow> windows, String key, int limit) {
        long now = System.currentTimeMillis();
        RateWindow window = windows.compute(key, (k, existing) -> {
            if (existing == null || now - existing.windowStart > 60_000) {
                return new RateWindow(now, new AtomicInteger(1));
            }
            existing.count.incrementAndGet();
            return existing;
        });
        return window.count.get() <= limit;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class RateWindow {
        final long windowStart;
        final AtomicInteger count;

        RateWindow(long windowStart, AtomicInteger count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
