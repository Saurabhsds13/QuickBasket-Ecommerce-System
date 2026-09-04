package com.dmart.clone.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Kafka wiring for the OMS integration.
 *
 * <p>Producer/consumer factories, {@code KafkaTemplate} and the listener
 * container factory are auto-configured by Spring Boot from the
 * {@code spring.kafka.*} properties. Here we only declare the two shared-contract
 * topics so they are auto-created against the broker when missing.
 */
@Configuration
public class KafkaConfig {

	@Value("${app.kafka.topic.orders-inbound}")
	private String ordersInboundTopic;

	@Value("${app.kafka.topic.orders-status}")
	private String ordersStatusTopic;

	@Bean
	public NewTopic ordersInboundTopic() {
		return TopicBuilder.name(ordersInboundTopic).partitions(3).replicas(1).build();
	}

	@Bean
	public NewTopic ordersStatusTopic() {
		return TopicBuilder.name(ordersStatusTopic).partitions(3).replicas(1).build();
	}
}
