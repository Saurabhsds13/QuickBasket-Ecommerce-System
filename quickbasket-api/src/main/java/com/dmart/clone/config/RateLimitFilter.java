package com.dmart.clone.config;

import java.io.IOException;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Redis-backed rate limiter per IP using sliding window counter.
 * Falls back to allowing requests if Redis is unavailable.
 */
@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);
    private static final String RATE_PREFIX = "ratelimit:";

    @Value("${app.ratelimit.auth.requests-per-minute:10}")
    private int authLimit;

    @Value("${app.ratelimit.api.requests-per-minute:60}")
    private int apiLimit;

    private final StringRedisTemplate redisTemplate;

    public RateLimitFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String ip = getClientIp(request);
        String path = request.getRequestURI();

        // Auth endpoints — strict limit
        if (path.startsWith("/api/auth/")) {
            if (!isAllowed("auth:" + ip, authLimit)) {
                writeRateLimitResponse(response, "Too many login attempts. Please wait 1 minute.");
                return;
            }
        }
        // General API — generous limit
        else if (path.startsWith("/api/")) {
            if (!isAllowed("api:" + ip, apiLimit)) {
                writeRateLimitResponse(response, "Rate limit exceeded. Please slow down.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(String key, int limit) {
        try {
            String redisKey = RATE_PREFIX + key;
            Long count = redisTemplate.opsForValue().increment(redisKey);
            if (count != null && count == 1) {
                // First request in window — set expiry
                redisTemplate.expire(redisKey, Duration.ofMinutes(1));
            }
            return count == null || count <= limit;
        } catch (Exception e) {
            // Redis down — fail open (allow request)
            log.warn("Rate limiter Redis unavailable, allowing request: {}", e.getMessage());
            return true;
        }
    }

    private void writeRateLimitResponse(HttpServletResponse response, String message) throws IOException {
        response.setContentType("application/json");
        response.setStatus(429);
        response.setHeader("Retry-After", "60");
        response.getWriter().write("{\"status\":429,\"message\":\"" + message + "\"}");
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
