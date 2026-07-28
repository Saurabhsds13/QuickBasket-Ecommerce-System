# QuickBasket — Full-Stack E-Commerce Platform

A production-grade grocery e-commerce system built with **Spring Boot** and **React**, demonstrating end-to-end software architecture — from secure authentication and payment processing to real-time notifications and optimized frontend delivery.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React 19)                        │
│  Route-level code splitting • Lazy loading • Context API state  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTPS / REST
┌────────────────────────────────▼────────────────────────────────┐
│                    API SERVER (Spring Boot 3.2)                  │
│  JWT Auth + Refresh Tokens • Role-based access (USER/ADMIN)     │
│  Razorpay Payment Integration • Image Upload & Storage          │
└────────────────────────────────┬────────────────────────────────┘
                                 │ JPA / Hibernate
┌────────────────────────────────▼────────────────────────────────┐
│                        MySQL 8.0                                 │
│  20 entities • Normalized schema • Indexed queries              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Tailwind CSS, Framer Motion, Lucide Icons |
| State | Context API (Auth + Cart), localStorage (guest cart, recently viewed) |
| API Client | Axios with interceptors, silent token refresh, request queuing |
| Backend | Spring Boot 3.2, Java 17, Spring Security, Spring Data JPA |
| Auth | JWT (access + refresh tokens), BCrypt, role-based (`USER` / `ADMIN`) |
| Payments | Razorpay (order creation, client checkout, server-side verification) |
| Database | MySQL 8.0, 20+ entities, Hibernate DDL |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Build | Vite 7 (frontend), Maven (backend) |
| Optimization | Code splitting, manual vendor chunks, lazy image loading |

---

## Features

### Customer-Facing
- **Product Catalog** — Browse 170+ products across 20 categories with search, price range filter, sort, and pagination
- **Product Detail** — Full description, image, stock status, reviews & ratings, wishlist toggle
- **Cart** — Dual-mode: backend-synced for logged-in users, localStorage for guests
- **Checkout** — Address selection, payment method (Razorpay / COD), coupon codes, bill summary
- **Orders** — Order history with status progression (Pending → Confirmed → Shipped → Delivered), cancel with reason
- **Return/Refund** — Request returns on delivered orders with reason selection and status tracking
- **Notifications** — Bell icon with unread badge, dropdown, full notifications page, 30s polling
- **Invoice** — Print-friendly invoice page for delivered orders (Save as PDF)
- **Wishlist** — Save products for later, move to cart
- **Addresses** — CRUD with type labels (Home/Work/Other), default selection
- **User Profile** — Edit email, phone, change password, delete account
- **Recently Viewed** — localStorage-tracked, shown on homepage
- **Reviews & Ratings** — Write reviews, star ratings displayed on product cards

### UX / Performance
- **Premium Navbar** — Apple/Nike inspired: expandable search overlay, centered nav, full-screen mobile menu, uniform icon sizing
- **Code Splitting** — Route-level lazy loading via `React.lazy` + `Suspense`
- **Vendor Chunking** — Separate cached bundles for React, UI libs, and data libs (initial load reduced 58%)
- **Lazy Images** — Native `loading="lazy"` on product grids
- **Responsive** — Mobile-first, full-screen mobile nav, bottom filter drawer on products page
- **Toast System** — Success/error/warning/info notifications

### Backend Capabilities
- **JWT with Refresh Token Rotation** — Silent refresh, queued retries on 401
- **Razorpay Integration** — Create payment order, open checkout, verify signature server-side
- **Admin APIs** — Product CRUD + image upload, category management, coupon management, order status updates, user management
- **Product Search** — Keyword + category + price range + sort with paginated results
- **Best Selling / Top Rated** — Aggregate queries with fallback to newest
- **Audit Models** — `AdminAuditLog`, `InventoryLog`, `SystemConfig` (ready for OMS microservice)

---

## Project Structure

```
QuickBasket-Ecommerce-System/
│
├── DMART-CLIENT/                    # React frontend
│   ├── src/
│   │   ├── components/              # Navbar, ProductCard, Modals, Toast, etc.
│   │   ├── context/                 # AuthContext, CartContext
│   │   ├── hooks/                   # useRecentlyViewed
│   │   ├── pages/                   # Home, AllProducts, Checkout, Orders, Invoice, etc.
│   │   └── services/api.js          # Axios instance + all API functions
│   ├── vite.config.js               # Build optimization (manual chunks)
│   └── package.json
│
├── DMART-SERVER/                    # Spring Boot backend
│   └── src/main/java/com/dmart/clone/
│       ├── admin/                   # Admin controllers + services
│       ├── config/                  # Security, CORS, Admin seeder
│       ├── controller/              # REST controllers (12 controllers)
│       ├── dto/                     # Request/Response records (23 DTOs)
│       ├── exception/               # Global exception handler
│       ├── model/                   # JPA entities (20 models)
│       ├── repository/              # Spring Data repositories
│       ├── security/                # JWT filter + utility
│       └── service/                 # Business logic (interface + impl)
│
├── Images/                          # Uploaded product images (local storage)
├── docs/                            # SRS, schema docs, ERD
└── seed-data.sql                    # Full database seed (categories + products + images)
```

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0
- Maven

### Backend

```bash
cd DMART-SERVER
# Configure database in src/main/resources/application.properties
mvn spring-boot:run
```

The admin user is auto-seeded on first run (`admin` / `Adminpassword@123`).

### Frontend

```bash
cd DMART-CLIENT
npm install
npm run dev
```

Runs on `http://localhost:5173`, API proxied to `http://localhost:8080`.

### Database Seed

```bash
# After first run creates tables:
mysql -u root -proot dmart < DMART-SERVER/src/main/resources/seed.sql
```

Seeds 20 categories, 170 products, and product images.

---

## API Overview

| Module | Endpoints | Auth |
|--------|-----------|------|
| Auth | Login, Register, Refresh, Logout | Public |
| Products | List, Search, By Category, Best Selling, Top Rated, Detail | Public |
| Reviews | Get reviews/rating (public), Write/Delete (auth) | Mixed |
| Cart | Get, Add, Update quantity, Remove, Clear | Auth |
| Orders | Place, List, Detail, Cancel | Auth |
| Returns | Create request, List, By order | Auth |
| Notifications | List, Unread count, Mark read, Mark all | Auth |
| Wishlist | List, Add, Remove, Check | Auth |
| Addresses | List, Add, Update, Set default, Delete | Auth |
| Payments | Create Razorpay order, Verify payment | Auth |
| Coupons | Apply coupon | Auth |
| Admin | Products CRUD, Categories, Orders, Users, Coupons | Admin |

Full Swagger docs available at `/swagger-ui.html` when running.

---

## Roadmap

Planned for the next iteration (microservice architecture):

- [ ] **Redis** — Session caching, product catalog cache, rate limiting
- [ ] **Apache Kafka** — Event-driven order processing, notification dispatch, inventory sync
- [ ] **API Gateway** — Spring Cloud Gateway for routing, load balancing, circuit breaking
- [ ] **OMS Microservice** — Dedicated order management with saga pattern
- [ ] **Admin Microservice** — Separate admin panel with analytics dashboard
- [ ] **Email Service** — Async email via Kafka consumers (order confirmation, shipping updates)
- [ ] **Elasticsearch** — Full-text product search with fuzzy matching and auto-suggest
- [ ] **Docker + K8s** — Containerized deployment with orchestration

---

## Author

**Saurabh Sonawane**

- LinkedIn: [linkedin.com/in/saurabhsds13](https://www.linkedin.com/in/saurabhsds13)
- GitHub: [github.com/Saurabhsds13](https://github.com/Saurabhsds13)
- Email: saurabhdsds13@gmail.com

---

## License

This project is for educational and portfolio demonstration purposes.
