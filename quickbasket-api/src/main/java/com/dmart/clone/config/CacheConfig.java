package com.dmart.clone.config;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.util.HashMap;
import java.util.Map;

/**
 * Redis-backed cache configuration.
 * Provides different TTLs for different cache regions.
 * If Redis is down, the app still works — cache misses just hit the DB.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Value("${app.cache.ttl.default:300}")
    private long defaultTtl;

    @Value("${app.cache.ttl.categories:1800}")
    private long categoriesTtl;

    @Value("${app.cache.ttl.products:300}")
    private long productsTtl;

    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(defaultTtl))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        // Per-cache TTL overrides
        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("categories", defaultConfig.entryTtl(Duration.ofSeconds(categoriesTtl)));
        cacheConfigs.put("products", defaultConfig.entryTtl(Duration.ofSeconds(productsTtl)));
        cacheConfigs.put("productById", defaultConfig.entryTtl(Duration.ofSeconds(productsTtl)));
        cacheConfigs.put("productsByCategory", defaultConfig.entryTtl(Duration.ofSeconds(productsTtl)));
        cacheConfigs.put("bestSelling", defaultConfig.entryTtl(Duration.ofSeconds(600)));
        cacheConfigs.put("topRated", defaultConfig.entryTtl(Duration.ofSeconds(600)));
        cacheConfigs.put("productRatings", defaultConfig.entryTtl(Duration.ofSeconds(300)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .transactionAware()
                .build();
    }
}
