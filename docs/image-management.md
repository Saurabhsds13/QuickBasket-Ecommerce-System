# Image Management - QuickBasket

## Overview

This document explains how product and category images are stored, served, and managed in the QuickBasket application.

---

## Current Architecture (Local Storage)

```
┌──────────────────┐                                          ┌──────────────────────┐
│   Admin Panel    │   POST /api/admin/categories/{id}/image  │                      │
│   or API Client  │ ─────────── multipart/form-data ───────► │   Spring Boot        │
│                  │                                          │   Backend (8080)     │
└──────────────────┘                                          └──────────┬───────────┘
                                                                         │
                                                              LocalStorageService.store()
                                                                         │
                                                                         ▼
                                                      ┌──────────────────────────────────────┐
                                                      │  D:/Personal Projects/               │
                                                      │  QuickBasket-Ecommerce-System/       │
                                                      │  Images/                             │
                                                      │    ├── products/                     │
                                                      │    │   ├── a1b2c3d4.jpg              │
                                                      │    │   └── e5f6g7h8.png              │
                                                      │    └── categories/                   │
                                                      │        └── i9j0k1l2.jpg              │
                                                      └──────────────────────────────────────┘
                                                                         │
                                                         DB stores relative path:
                                                         "/uploads/categories/i9j0k1l2.jpg"
                                                                         │
                                                                         ▼
┌──────────────────┐   GET localhost:8080/uploads/categories/i9j0k1l2.jpg  ┌─────────────────┐
│  React Client    │ ◄─────────── served as static file ──────────────────  │  WebConfig      │
│  (Vite :5173)    │                                                        │  ResourceHandler│
└──────────────────┘                                                        └─────────────────┘
```

---

## How It Works Step by Step

### 1. Upload (Admin → Backend)

The admin uploads an image by calling the endpoint:

```
POST /api/admin/categories/{id}/image
Content-Type: multipart/form-data
Authorization: Bearer <admin_jwt_token>
Body: file = <image_file>
```

For products:
```
POST /api/admin/products/{id}/images
Content-Type: multipart/form-data
Authorization: Bearer <admin_jwt_token>
Body: file = <image_file>
```

### 2. Storage (Backend → Disk)

`LocalStorageService.store()` handles the file:

1. Extracts the file extension from the original filename
2. Generates a UUID-based filename (e.g., `a1b2c3d4-e5f6-7890.jpg`)
3. Creates the target directory if it doesn't exist (`Images/categories/` or `Images/products/`)
4. Saves the file to disk
5. Returns a relative URL path: `/uploads/categories/a1b2c3d4.jpg`

### 3. Database Record

The returned path is stored in the entity:

- **Category:** `category.imageUrl = "/uploads/categories/uuid.jpg"`
- **Product:** `productImage.imageUrl = "/uploads/products/uuid.jpg"` (with `isPrimary` flag)

The database does NOT store the actual image binary — only the path string.

### 4. Serving (Backend → Frontend)

`WebConfig.java` registers a static resource handler:

```java
registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:" + basePath + "/");
```

This maps any request to `/uploads/**` to the physical folder `D:/Personal Projects/QuickBasket-Ecommerce-System/Images/`.

The URL `/uploads/categories/uuid.jpg` resolves to the file at:
`D:/Personal Projects/QuickBasket-Ecommerce-System/Images/categories/uuid.jpg`

### 5. Frontend Display

React constructs the full image URL:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // "http://localhost:8080"
const imageUrl = `${API_BASE_URL}${category.imageUrl}`;
// Result: "http://localhost:8080/uploads/categories/uuid.jpg"
```

---

## Configuration

**application.properties:**
```properties
disk.upload.basepath=D:/Personal Projects/QuickBasket-Ecommerce-System/Images
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

**Security (SecurityConfig.java):**
The `/uploads/**` path is permitted without authentication:
```java
.requestMatchers("/uploads/**").permitAll()
```

---

## Key Files

| File | Purpose |
|------|---------|
| `StorageService.java` | Interface defining store/load/delete operations |
| `LocalStorageService.java` | Implementation — saves files to local disk |
| `WebConfig.java` | Serves uploaded files as static resources |
| `AdminCategoryController.java` | Category image upload endpoint |
| `AdminProductController.java` | Product image upload endpoint |
| `application.properties` | Configures `disk.upload.basepath` |

---

## How to Upload Category Images

### Via cURL (Terminal)

```bash
# 1. Login as admin to get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Adminpassword@123"}'

# Response: { "token": "eyJhbG...", ... }

# 2. Upload image to category (replace {id} with actual category ID)
curl -X POST http://localhost:8080/api/admin/categories/1/image \
  -H "Authorization: Bearer <token_from_step_1>" \
  -F "file=@/path/to/fruits.jpg"
```

### Via Postman

1. Set method to `POST`
2. URL: `http://localhost:8080/api/admin/categories/1/image`
3. Headers: `Authorization: Bearer <your_admin_token>`
4. Body tab → form-data → key: `file` (type: File) → select image

---

## Image Recommendations

### For Categories
- **Size:** 400×400px (square)
- **Format:** PNG (transparent background) or JPG
- **File size:** Under 200KB for fast loading
- **Style:** Clean, minimal — single hero item representing the category
  - Fruits → A colorful arrangement of 2-3 fruits
  - Dairy → Milk bottle or cheese wedge
  - Vegetables → Fresh greens on white/transparent background

### For Products
- **Size:** 800×800px (square)
- **Format:** PNG with white/transparent background preferred
- **File size:** Under 500KB
- **Style:** Product-only shot, well-lit, no busy backgrounds

### Where to Get Free High-Quality Images
- [Unsplash](https://unsplash.com) — Photo-realistic, free commercial use
- [Pexels](https://pexels.com) — Similar to Unsplash, free
- [Freepik](https://freepik.com) — Illustrations and photos (attribution required on free tier)
- [Remove.bg](https://remove.bg) — Remove backgrounds from product photos
- [Squoosh](https://squoosh.app) — Compress and resize before uploading

---

## Production Recommendation: Cloudinary

For deployment and client-facing environments, migrate from local storage to Cloudinary.

### Why Cloudinary?

| Feature | Local Storage (Current) | Cloudinary |
|---------|------------------------|------------|
| Cost | Free | Free tier: 25GB + 25K transforms/month |
| CDN | ❌ No caching | ✅ Global CDN (fast worldwide) |
| Auto-optimization | ❌ Manual | ✅ WebP, auto-quality, resize on-the-fly |
| Responsive images | ❌ | ✅ Serve different sizes per device |
| Deployment | ❌ Files lost on redeploy | ✅ Persistent cloud storage |
| Dashboard | ❌ | ✅ Visual upload manager |

### How It Would Work

1. **Upload:** Either via Cloudinary's web dashboard (drag-and-drop) or via API
2. **URL generated:** `https://res.cloudinary.com/your-cloud/image/upload/v123/categories/fruits.jpg`
3. **Store in DB:** Save the full Cloudinary URL in `category.imageUrl`
4. **Frontend:** Use the URL directly (no `API_BASE_URL` prefix needed)

### Auto-Transform URLs

Cloudinary lets you add transformations in the URL:

```
https://res.cloudinary.com/yourcloud/image/upload/w_400,h_400,c_fill,q_auto,f_auto/categories/fruits.jpg
```

- `w_400,h_400` — Resize to 400×400
- `c_fill` — Crop to fill (no distortion)
- `q_auto` — Automatic quality optimization
- `f_auto` — Serve WebP to supported browsers, fallback to JPG

### Migration Steps

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Upload existing images from `Images/` folder to Cloudinary dashboard
3. Create `CloudinaryStorageService` implementing `StorageService` interface
4. Update `category.imageUrl` values in DB to use Cloudinary URLs
5. Remove `WebConfig` resource handler (no longer needed)
6. Frontend works as-is if URLs are full HTTPS (just remove `API_BASE_URL` prefix logic)

---

## Fallback Handling

When no image is uploaded:

- **Products:** Falls back to `/fallback-product.png` in the `public/` folder
- **Categories:** Falls back to an emoji-based icon system that maps category names to relevant emojis (e.g., "Fruits" → 🍎, "Dairy" → 🥛)

The emoji fallback is defined in `Home.jsx` via the `getCategoryStyle()` function which matches keywords in the category name to appropriate emojis and background colors.
