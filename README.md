# 🛒 Full Stack E-Commerce Platform

This is a full-stack clone of Ecommerce Site built as a **learning-focused prototype** and **technical skills showcase**.  
The project is structured as a **monorepo** with both backend and frontend code organized under one repository.

---

## 📌 Project Overview

This e-commerce platform demonstrates a scalable and modular architecture using:

- 🔙 **Spring Boot** (Java) as the backend REST API
- 🖥 **React.js** as the frontend UI
- 💽 **MySQL** with a database-first approach for schema design

This application replicates the core functionalities of a modern e-commerce platform, including:

- User registration & login
- Product catalog browsing
- Cart management
- Order placement
- Address handling
- Role-based access (Admin & Customer)


> 🛠️ Built using a **database-first approach**, where the data model forms the backbone of application logic.

> ✅ This project follows the full Software Development Life Cycle (SDLC), including business requirements, design documentation, implementation, and future scalability considerations.

---

## 🎯 Purpose

- To **demonstrate enterprise-grade coding practices**
- Serve as a **prototype** for scalable e-commerce systems
- Practice full-stack development with clean separation of concerns
- Present a ready-to-show project for **interviews, portfolio**, or **client POCs**

---


## 🧱 Tech Stack

| Layer        | Technology             |
|--------------|------------------------|
| Frontend     | React.js, Tailwind CSS |
| Backend API  | Spring Boot (Java)     |
| Database     | MySQL                  |
| ORM/DAO      | Spring Data JPA        |
| Project Tool | Maven (Java) + npm (JS)|
| Version Ctrl | Git & GitHub           |

---

## 📁 Monorepo Structure


```
Ecommerce-clone/
├── backend/                  # Spring Boot application
│   ├── src/
│   │   ├── main/java/com/Ecommerceclone/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   └── EcommerceCloneApplication.java
│   │   └── resources/
│   │       └── application.properties
│   ├── pom.xml
│   └── README.md            
│
├── frontend/                 # React.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md            
│
├── docs/                     # Documentation assets
│   ├── SRS.docx
│   ├── Ecommerce_schema_documentation.xlsx
│   └── ERD.png               # database ER diagram image
│
├── .gitignore
└── README.md                 # Main readme (this file)
```
---

## 🚀 How to Run

### Backend (Spring Boot)

1. Clone the repository
2. Configure DB connection in `application.properties`
3. Reverse engineer database using JPA tools (e.g., `spring.jpa.hibernate.ddl-auto=none`)
4. Run `EcommerceServerApplication.java`

### Frontend (React)

1. Navigate to `/frontend`
2. Run `npm install`
3. Run `npm start`

---


## 🧩 Database Schema

- MySQL with a well-normalized schema
- Core Tables: `users`, `products`, `orders`, `order_items`, `addresses`, `cart_items`, `categories`
- Plus additional: `user_roles`, `payments`, `reviews`, etc.

> 📝 Full schema documentation is available in `/docs/Ecommerce - Schema Documentation.xlsx`

---

## ✅ Features

- 🔐 Authentication & Role Management
- 🛍️ Product Listings with Categories
- 🧺 Cart and Checkout Flow
- 📦 Order History and Tracking
- 🧑 Admin: Add/Edit Products & Categories
- 📄 RESTful APIs (Swagger Support optional)

---

## 📈 Future Scope

- 🧾 Coupon & Discount Management
- 📤 Email Notifications
- 💳 Payment Gateway Integration
- 📦 Delivery Tracking API
- 📊 Admin Dashboard with Charts


## 👨‍💻 Author
**Saurabh Sonawane**  
- 🔗 LinkedIn: [https://www.linkedin.com/in/saurabhsds13]  
- 🐙 GitHub: [https://github.com/Saurabhsds13]  
- 📧 Email: saurabhdsds13@gmail.com


## ⚠️ Disclaimer
This prototype project is for educational and demonstration purposes only and is not affiliated with or endorsed by any e-commerce organization.
