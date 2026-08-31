// Minimal fetch-based Server-Sent Events client for the order-status stream.
//
// The browser's native EventSource cannot send an Authorization header, but
// QuickBasket authenticates with a Bearer token from localStorage. This helper
// uses fetch + ReadableStream so the token flows through the standard header,
// consistent with the rest of the API layer, and auto-reconnects on drop.

const API_BASE_URL = "http://localhost:8080/api";

/**
 * Subscribe to GET /api/orders/stream.
 *
 * @param {(update: object) => void} onStatus called with each order-status payload
 * @param {object} [opts]
 * @param {() => void} [opts.onOpen] called once the stream is connected
 * @param {(err: unknown) => void} [opts.onError] called on connection error
 * @returns {() => void} unsubscribe function that closes the stream
 */
export function subscribeOrderStream(onStatus, opts = {}) {
  const { onOpen, onError } = opts;
  let closed = false;
  let controller = null;
  let retryDelay = 3000;

  const connect = async () => {
    if (closed) return;
    const token = localStorage.getItem("token");
    if (!token) {
      // Not authenticated yet; retry later.
      scheduleReconnect();
      return;
    }

    controller = new AbortController();
    try {
      const res = await fetch(`${API_BASE_URL}/orders/stream`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        credentials: "include",
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`SSE connect failed: ${res.status}`);
      }

      retryDelay = 3000; // reset backoff on success
      if (onOpen) onOpen();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (!closed) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by a blank line.
        let sepIndex;
        while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
          const rawFrame = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);
          handleFrame(rawFrame);
        }
      }
    } catch (err) {
      if (closed) return;
      if (onError) onError(err);
      scheduleReconnect();
    }
  };

  const handleFrame = (rawFrame) => {
    let eventName = "message";
    const dataLines = [];
    for (const line of rawFrame.split("\n")) {
      if (line.startsWith("event:")) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      }
      // lines starting with ":" are comments/heartbeats — ignored
    }
    if (eventName !== "order-status" || dataLines.length === 0) return;
    try {
      onStatus(JSON.parse(dataLines.join("\n")));
    } catch {
      // ignore malformed payloads
    }
  };

  const scheduleReconnect = () => {
    if (closed) return;
    setTimeout(connect, retryDelay);
    retryDelay = Math.min(retryDelay * 2, 30000); // exponential backoff, cap 30s
  };

  connect();

  return () => {
    closed = true;
    if (controller) controller.abort();
  };
}
