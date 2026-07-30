package com.dmart.clone.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

/**
 * Service to programmatically evict cache entries.
 * Called by admin operations when products/categories are modified.
 */
@Service
public class CacheEvictionService {

    private static final Logger log = LoggerFactory.getLogger(CacheEvictionService.class);

    @CacheEvict(value = {"products", "productById", "productsByCategory", "bestSelling", "topRated"}, allEntries = true)
    public void evictAllProductCaches() {
        log.info("Evicted all product caches");
    }

    @CacheEvict(value = "categories", allEntries = true)
    public void evictCategoryCache() {
        log.info("Evicted category cache");
    }

    @CacheEvict(value = "productRatings", allEntries = true)
    public void evictRatingCache() {
        log.info("Evicted product rating cache");
    }

    @CacheEvict(value = {"products", "productById", "productsByCategory", "bestSelling", "topRated", "categories", "productRatings"}, allEntries = true)
    public void evictAll() {
        log.info("Evicted ALL caches");
    }
}
