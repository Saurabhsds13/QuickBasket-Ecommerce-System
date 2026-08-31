# Local End-to-End Test: QuickBasket ↔ OMS Round Trip

This walks through exercising the Kafka integration on your machine without the
real OMS. You place an order, confirm QuickBasket produced `ORDER_PLACED`, then
play the OMS by hand-producing a status message and watch the order update and
the live SSE push reach the browser.

See `docs/oms-integration.md` for the message contract.

## Prerequisites

- Docker Desktop (for the Kafka stack in `docker-compose.yml`)
- The QuickBasket API (`quickbasket-api`) and web app (`quickbasket-web`)
  runnable as usual (MySQL + Redis available, per `application.properties`)

## 1. Start Kafka

From the repo root:

```powershell
docker compose up -d
```

- Broker: `localhost:9092` (matches the API's default `KAFKA_BOOTSTRAP_SERVERS`)
- Kafka-UI: http://localhost:8085

Wait until the broker is healthy:

```powershell
docker compose ps
```

The two contract topics (`oms.orders.inbound`, `oms.orders.status`) are created
automatically by the API on startup (or on first use). You can also see them in
Kafka-UI under the `quickbasket-local` cluster once the API has started.

## 2. Start QuickBasket

Run the API and the web app the way you normally do (e.g. from your IDE, or
`./mvnw spring-boot:run` for the API and `npm run dev` for the web app). No extra
config is needed — the defaults point at `localhost:9092`.

Sign in to the web app so you have an authenticated user; the SSE stream and
notifications are per-user.

## 3. Place an order → verify `ORDER_PLACED`

Place an order through the UI:

- **COD:** the event is produced at placement.
- **Online (Razorpay test):** the event is produced after payment verification.

Then confirm the message landed on `oms.orders.inbound`:

**Via Kafka-UI:** open the `oms.orders.inbound` topic → Messages. You should see
a message keyed by the order number (`QB-<id>`) with an `ORDER_PLACED` body.

**Via CLI (inside the broker container):**

```powershell
docker exec -it quickbasket-kafka /opt/kafka/bin/kafka-console-consumer.sh `
  --bootstrap-server localhost:9092 `
  --topic oms.orders.inbound `
  --from-beginning --property print.key=true
```

Note the `orderNumber` from the payload (e.g. `QB-100234`); you'll reuse it in
the next step.

## 4. Play the OMS → produce a status message

Send a status change on `oms.orders.status`, keyed by the same `orderNumber`.

**Via Kafka-UI:** open the `oms.orders.status` topic → Produce Message. Set the
key to your order number and the value to the JSON below.

**Via CLI:**

```powershell
docker exec -it quickbasket-kafka /opt/kafka/bin/kafka-console-producer.sh `
  --bootstrap-server localhost:9092 `
  --topic oms.orders.status `
  --property "parse.key=true" --property "key.separator=|"
```

Then paste one line (replace the order number with yours):

```
QB-100234|{"eventType":"ORDER_APPROVED","orderNumber":"QB-100234","status":"APPROVED","occurredAt":"2026-08-30T10:05:00Z"}
```

Press Enter, then Ctrl+C to exit the producer.

Try a few in sequence to watch the lifecycle:

```
QB-100234|{"eventType":"ORDER_APPROVED","orderNumber":"QB-100234","status":"APPROVED","occurredAt":"2026-08-30T10:05:00Z"}
QB-100234|{"eventType":"ORDER_PARTIALLY_SHIPPED","orderNumber":"QB-100234","status":"PARTIALLY_SHIPPED","occurredAt":"2026-08-30T11:00:00Z"}
QB-100234|{"eventType":"ORDER_SHIPPED","orderNumber":"QB-100234","status":"SHIPPED","occurredAt":"2026-08-30T12:00:00Z"}
```

## 5. Verify the QuickBasket side updated

Within a moment of producing each status message you should see:

- **Orders page:** the order's status badge updates live (no refresh) —
  `APPROVED`, `PARTIALLY_SHIPPED`, `SHIPPED`.
- **Notification bell:** the unread count bumps and a new `ORDER` notification
  appears instantly (SSE), not on the 30s poll.
- **API logs:** a line like
  `Received order-status event ORDER_APPROVED for QB-100234 (status=APPROVED)`.
- **Database:** a new row per event in `order_status_history`, and
  `orders.status` reflects the latest value.

If the browser does not update live, confirm the SSE stream is connected: in the
browser dev tools Network tab you should see a long-lived request to
`/api/orders/stream`.

## Troubleshooting

- **No `ORDER_PLACED` message:** confirm the order actually committed (COD:
  placement; online: payment verified) and that the API connected to Kafka
  (check startup logs for the broker address).
- **Consumer ignores your status message:** the `orderNumber` in the value must
  match an existing order. Unknown order numbers are logged and skipped.
- **Status doesn't change but history is recorded:** the `status` value wasn't
  one of `PENDING, APPROVED, PARTIALLY_SHIPPED, SHIPPED, CANCELLED`.
- **Live UI not updating:** make sure you're logged in as the order's owner —
  the stream is per authenticated user.

## Teardown

```powershell
docker compose down          # stop containers, keep nothing persistent
docker compose down -v       # also remove volumes (fresh broker next time)
```
