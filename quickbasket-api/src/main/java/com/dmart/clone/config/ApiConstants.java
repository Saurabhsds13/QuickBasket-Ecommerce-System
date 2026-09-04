package com.dmart.clone.config;

/**
 * Central place for API path constants.
 * Currently v1 — when breaking changes are needed, add v2 paths here.
 */
public final class ApiConstants {

    private ApiConstants() {}

    public static final String API_V1 = "/api/v1";
    public static final String API_PUBLIC = "/api/public";
    public static final String API_USER = "/api/user";
    public static final String API_ADMIN = "/api/admin";
    public static final String API_AUTH = "/api/auth";

    // Future versioned paths
    // public static final String API_V2 = "/api/v2";
}
