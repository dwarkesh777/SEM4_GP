---
label: Developer Portal
icon: code
order: 920
---

# 👨‍💻 Developer Portal Documentation

The Developer Portal provides software developers and API integrators (`is_developer=True`) with dedicated access to NestNode API specifications, platform metrics, and system status logs.

---

## 🔒 Authentication Isolation

Developers are managed using isolated authentication flows:

- **Database Flag**: `User.is_developer = True`
- **Developer Signup Endpoint**: `POST /api/auth/developer/signup/`
- **Developer Login Endpoint**: `POST /api/auth/developer/login/`
- **Security Check**: `UserTokenObtainPairSerializer` explicitly blocks developer accounts from logging into the student login portal, preventing role mixing.

---

## 🖥️ Developer Dashboard Features (`DeveloperDashboard.jsx`)

### 1. API Documentation Tab
- Interactive HTTP request samples for Properties, Authentication, and Bookings.
- Header specifications for JWT Bearer Tokens (`Authorization: Bearer <access_token>`).

### 2. System Status & Metrics
- Live API health checks (`/api/auth/developer/status/`).
- Database active connection metrics and response latency.

### 3. Navigation Bar Integration
When logged in as a Developer, the global `Navbar.jsx` dropdown menu highlights **Developer Dashboard** and routes directly to `/developer/dashboard`.
