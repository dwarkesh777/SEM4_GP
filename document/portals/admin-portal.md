---
label: Admin Portal
icon: shield-check
order: 910
---

# 🛡️ Admin Portal Documentation

The Admin Portal is restricted to platform staff (`is_staff=True`) and superusers (`is_superuser=True`). It provides high-level monitoring and administration of all registered users, properties, and system transactions.

---

## 🔑 Key Features (`AdminDashboard.jsx`)

### 1. Platform-Wide Analytics
- Total system users count (Students, Owners, Developers).
- Total properties listed across all cities.
- Total active bookings and platform revenue.

### 2. User & Owner Management
- Inspect user accounts and modify role flags.
- Review owner identity verification submissions (PAN, Aadhaar, Bank IFSC).
- Promote or demote user permissions.

### 3. Property Moderation
- Review pending property listings (`AdminPropertyDetail.jsx`).
- Toggle property verification badges (`is_verified`).
- Unlist or remove non-compliant properties.
