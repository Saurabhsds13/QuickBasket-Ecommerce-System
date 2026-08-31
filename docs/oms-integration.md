# QuickBasket ↔ OMS Integration Contract

This document describes the QuickBasket side of the Kafka integration with the
external Order Management System (OMS), as implemented. It is intended as a
reference for the OMS team.

## Topics

| Topic                | Direction          | Key           | QuickBasket role            |
| -------------------- | ------------------ | ------------- | --------------------------- |
| `oms.orders.inbound` | QuickBasket → OMS  | `orderNumber` | Producer                    |
| `oms.orders.status`  | OMS → QuickBasket  | `orderNumber` | Consumer (group `quickbasket`) |

## QuickBasket → `oms.orders.inbound`

QuickBasket produces an `ORDER_PLACED` event **after the order is durably
committed** (produce-after-commit):

- **Online orders:** on successful payment verification.
- **COD orders:** at order placement.

Message (key = `orderNumber`):

```json
{
  "eventType": "ORDER_PLACED",
  "orderNumber": "QB-100234",
  "items": [ { "productCode": "SKU-1", "quantity": 2 } ],
  "occurredAt": "2026-08-30T10:00:00Z"
}
```

Notes:

- `orderNumber` format is `QB-<id>` (e.g. `QB-100234`). It is the correlation
  key for all messages in both directions.
- `productCode` is currently derived as `SKU-<productId>`. QuickBasket has no
  dedicated SKU field yet. If the OMS expects real catalog SKUs, this must be
  agreed (open item #1).
- `occurredAt` is UTC ISO-8601.

## OMS → `oms.orders.status`

QuickBasket consumes order-status changes. Expected message (key =
`orderNumber`):

```json
{
  "eventType": "ORDER_APPROVED",
  "orderNumber": "QB-100234",
  "status": "APPROVED",
  "occurredAt": "2026-08-30T10:05:00Z"
}
```

On each message QuickBasket:

1. Looks up the local order by `orderNumber`.
2. Updates the order's status.
3. Appends a status-history record (audit trail).
4. Creates a user notification.
5. Pushes a live update to the user's browser over SSE.

### Accepted values

Send exactly as documented (QuickBasket matches case-insensitively but the
canonical forms are):

- `status`: `PENDING`, `APPROVED`, `PARTIALLY_SHIPPED`, `SHIPPED`, `CANCELLED`
- `eventType`: `ORDER_PLACED`, `ORDER_APPROVED`, `ORDER_CANCELLED`,
  `ORDER_PARTIALLY_SHIPPED`, `ORDER_SHIPPED`

### Consumer behavior

- **Unknown `orderNumber`:** the message is logged and skipped; the offset is
  committed (no retry storm). Relevant for orders placed before this
  integration, which have no `orderNumber` until backfilled (open item #4).
- **Unknown `status`:** QuickBasket records the event in history but does not
  change the order's status.
- Consumer group: `quickbasket`. `auto-offset-reset=earliest`.

## Serialization & infrastructure

- Payloads are plain JSON.
- QuickBasket does **not** rely on Kafka type headers
  (`spring.json.use.type.headers=false`), so the OMS producer does not need to
  emit Spring type headers.
- Broker address is environment-driven: `KAFKA_BOOTSTRAP_SERVERS`
  (default `localhost:9092`).
- In dev, topics auto-create at **3 partitions / 1 replica**. For shared or
  production environments, agree on partition count and replication factor
  (open item #3).

## Ordering & delivery

- Both sides key on `orderNumber`, so all events for a single order land on the
  same partition and stay ordered — provided the partition count is stable.
- QuickBasket's producer uses `acks=all` with idempotence enabled. End-to-end
  delivery is **at-least-once**, so the OMS should treat `ORDER_PLACED`
  idempotently (dedupe on `orderNumber` + `eventType`).

## Open items to confirm

1. **`productCode`** — `SKU-<productId>` (current) vs. real catalog SKUs.
2. **Paid state vocabulary** — QuickBasket sets the local status to `CONFIRMED`
   on payment success; the OMS lifecycle uses `APPROVED`. Confirm whether
   QuickBasket should surface `APPROVED` instead, or keep `CONFIRMED` locally
   while mapping incoming OMS statuses.
3. **Partition/replication** settings for the shared topics.
4. **Backfill** of `orderNumber` for orders that existed before this
   integration (otherwise OMS status events for those orders are skipped).
