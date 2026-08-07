---
label: System Overview
icon: cpu
order: 970
---

# 🏗️ System Architecture & Design Overview

NestNode follows a decoupled client-server architecture. The frontend Single Page Application (SPA) communicates with the Django REST Framework API backend via stateless HTTP REST requests and JSON Web Token (JWT) authorization headers.

---

## 📐 High-Level Architecture Diagram

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|                                                                         |
|   +-------------------+  +-------------------+  +-------------------+   |
|   |   Student Portal  |  |   Owner Portal    |  |  Developer Portal |   |
|   |   (React / Vite)  |  |   (React / Vite)  |  |   (React / Vite)  |   |
|   +---------+---------+  +---------+---------+  +---------+---------+   |
+-------------|----------------------|----------------------|-------------+
              |                      |                      |
              +----------------------+----------------------+
                                     |
                         JSON / HTTPS (JWT Header)
                                     v
+-------------------------------------------------------------------------+
|                             BACKEND API LAYER                           |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                 Django REST Framework (Python 3.12)               |  |
|  |                                                                   |  |
|  |   +------------------+ +------------------+ +-----------------+   |  |
|  |   |   Auth & Roles   | |  Property Views  | |  Booking Views  |   |  |
|  |   +------------------+ +------------------+ +-----------------+   |  |
|  |   +------------------+ +------------------+ +-----------------+   |  |
|  |   | OTP & Reset API  | |  KNN Recommender | |  Razorpay API   |   |  |
|  |   +------------------+ +------------------+ +-----------------+   |  |
|  +-------------------------------------------------------------------+  |
+-------------|----------------------|----------------------|-------------+
              |                      |                      |
              v                      v                      v
      +---------------+      +---------------+      +---------------+
      | SQLite / Postgres |  | Cloudinary API |     |  Razorpay API |
      |  (Database)   |      |  (Media CDN)  |      |   (Payments)  |
      +---------------+      +---------------+      +---------------+
```

---

## 🔑 Architectural Principles

### 1. Role-Based Access Control (RBAC)
User permissions are controlled on both backend models and serializers:
- `is_owner`: Enables Property Owner dashboard and listing wizard.
- `is_developer`: Enables Developer Portal with isolated authentication.
- `is_staff` / `is_superuser`: Grants platform-wide admin privileges.
- Standard User: Student / Tenant account for browsing and booking properties.

### 2. Stateless JWT Authentication
Authentication uses `rest_framework_simplejwt`:
- Access Tokens (short-lived) sent in `Authorization: Bearer <token>` headers.
- Refresh Tokens (long-lived) stored in `localStorage` with auto-renewal via `AuthContext`.

### 3. Integrated Microservices & APIs
- **Cloudinary**: Handles high-resolution image uploads, webcam photo streams, and video storage without cluttering web application servers.
- **Razorpay**: Provides PCI-compliant payment checkout flows and backend signature verification.
- **Scikit-Learn KNN**: Machine learning pipeline standardizing numerical and categorical property attributes for real-time recommendations.
