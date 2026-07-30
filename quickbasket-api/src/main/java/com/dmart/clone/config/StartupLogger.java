package com.dmart.clone.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartupLogger {

    private static final Logger log = LoggerFactory.getLogger(StartupLogger.class);

    @Value("${server.port}")
    private int port;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.hikari.maximum-pool-size:10}")
    private int poolSize;

    @Value("${spring.jpa.hibernate.ddl-auto}")
    private String ddlAuto;

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        log.info("╔══════════════════════════════════════════╗");
        log.info("║      QuickBasket API — Ready            ║");
        log.info("╠══════════════════════════════════════════╣");
        log.info("║  Port:       {}                      ║", port);
        log.info("║  Database:   {}  ║", dbUrl.substring(dbUrl.lastIndexOf("/") + 1, dbUrl.contains("?") ? dbUrl.indexOf("?") : dbUrl.length()));
        log.info("║  Pool Size:  {}                        ║", poolSize);
        log.info("║  DDL:        {}                    ║", ddlAuto);
        log.info("║  Swagger:    http://localhost:{}/swagger-ui.html", port);
        log.info("║  Health:     http://localhost:{}/actuator/health", port);
        log.info("╚══════════════════════════════════════════╝");
    }
}
