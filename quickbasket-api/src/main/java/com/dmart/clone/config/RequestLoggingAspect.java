package com.dmart.clone.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * AOP aspect for logging all controller method executions.
 * Logs method name, execution time, and any errors.
 */
@Aspect
@Component
public class RequestLoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingAspect.class);

    @Around("execution(* com.dmart.clone.controller..*(..)) || execution(* com.dmart.clone.admin.controller..*(..))")
    public Object logRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        long start = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;

            if (duration > 500) {
                log.warn("[SLOW] {}.{} took {}ms", className, methodName, duration);
            } else {
                log.debug("[API] {}.{} completed in {}ms", className, methodName, duration);
            }

            return result;
        } catch (Exception ex) {
            long duration = System.currentTimeMillis() - start;
            log.error("[ERROR] {}.{} failed after {}ms: {}", className, methodName, duration, ex.getMessage());
            throw ex;
        }
    }
}
