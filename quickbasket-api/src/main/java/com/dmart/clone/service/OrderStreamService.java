package com.dmart.clone.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * Maintains server-sent-event connections per authenticated user (keyed by
 * userId) and pushes order-status updates to all of a user's open browser tabs.
 *
 * <p>A single user can hold multiple emitters (multiple tabs/devices), so we keep
 * a list per user and prune dead ones on send/timeout/error.
 */
@Service
public class OrderStreamService {

	private static final Logger log = LoggerFactory.getLogger(OrderStreamService.class);

	/** ~30 minutes; the client reconnects automatically when it lapses. */
	private static final long TIMEOUT_MS = 30 * 60 * 1000L;

	private final Map<Long, CopyOnWriteArrayList<SseEmitter>> emitters = new ConcurrentHashMap<>();

	public SseEmitter subscribe(Long userId) {
		SseEmitter emitter = new SseEmitter(TIMEOUT_MS);
		CopyOnWriteArrayList<SseEmitter> userEmitters = emitters.computeIfAbsent(userId,
				k -> new CopyOnWriteArrayList<>());
		userEmitters.add(emitter);

		emitter.onCompletion(() -> remove(userId, emitter));
		emitter.onTimeout(() -> remove(userId, emitter));
		emitter.onError(e -> remove(userId, emitter));

		try {
			// Initial handshake so the browser's EventSource fires 'open' promptly.
			emitter.send(SseEmitter.event().name("connected").data("ok"));
		} catch (IOException e) {
			remove(userId, emitter);
		}
		return emitter;
	}

	/**
	 * Push a named event with a serializable payload to every emitter owned by
	 * the given user. Dead emitters are pruned.
	 */
	public void sendToUser(Long userId, String eventName, Object payload) {
		List<SseEmitter> userEmitters = emitters.get(userId);
		if (userEmitters == null || userEmitters.isEmpty()) {
			log.debug("No active SSE subscribers for user {}", userId);
			return;
		}
		for (SseEmitter emitter : userEmitters) {
			try {
				emitter.send(SseEmitter.event().name(eventName).data(payload));
			} catch (Exception e) {
				log.debug("Removing dead SSE emitter for user {}: {}", userId, e.getMessage());
				remove(userId, emitter);
			}
		}
	}

	private void remove(Long userId, SseEmitter emitter) {
		CopyOnWriteArrayList<SseEmitter> userEmitters = emitters.get(userId);
		if (userEmitters != null) {
			userEmitters.remove(emitter);
			if (userEmitters.isEmpty()) {
				emitters.remove(userId);
			}
		}
	}
}
