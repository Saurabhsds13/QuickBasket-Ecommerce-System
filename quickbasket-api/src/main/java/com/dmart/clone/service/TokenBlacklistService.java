package com.dmart.clone.service;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

/**
 * Manages blacklisted JWT tokens in Redis.
 * When a user logs out, their access token is blacklisted until it naturally expires.
 * Every authenticated request checks this blacklist before processing.
 */
@Service
public class TokenBlacklistService {

    private static final Logger log = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String BLACKLIST_PREFIX = "token:blacklist:";

    private final StringRedisTemplate redisTemplate;

    public TokenBlacklistService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Blacklist a token with a TTL matching its remaining expiry time.
     */
    public void blacklist(String token, long expiryMillis) {
        try {
            long ttl = expiryMillis - System.currentTimeMillis();
            if (ttl > 0) {
                redisTemplate.opsForValue().set(
                        BLACKLIST_PREFIX + token,
                        "blacklisted",
                        Duration.ofMillis(ttl)
                );
                log.debug("Token blacklisted, TTL: {}ms", ttl);
            }
        } catch (Exception e) {
            log.error("Failed to blacklist token in Redis: {}", e.getMessage());
            // Don't fail the logout if Redis is down
        }
    }

    /**
     * Check if a token is blacklisted.
     */
    public boolean isBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
        } catch (Exception e) {
            log.error("Failed to check token blacklist in Redis: {}", e.getMessage());
            // If Redis is down, allow the request (fail open)
            return false;
        }
    }
}
