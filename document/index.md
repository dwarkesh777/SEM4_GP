---
label: Home
icon: house
order: 1000
---

# 🏠 NestNode Project Documentation

Welcome to the official documentation for **NestNode** — an enterprise-grade, full-stack Hostel & PG Accommodation Booking Platform designed for students, working professionals, and property owners.

[!badge variant="primary" text="Version 1.0.0"] [!badge variant="success" text="Production Ready"]

---

## 🌟 Platform Highlights

NestNode provides a seamless ecosystem connecting tenants and property owners through intuitive web interfaces, automated payment processing, role-based workflows, and intelligent recommendation systems.

=== 🔐 Multi-Role Ecosystem
- **Student & Guest Portal**: Advanced search by location, city, room type, budget, and gender, plus instant room booking and review submission.
- **Property Owner Portal**: Full listing management wizard with Terms & Conditions modal, 100% profile progress bar, identity verification (PAN/Aadhar/IFSC), live webcam photo capture, and bed availability controls.
- **Developer Portal**: Isolated developer authentication (`is_developer`), developer dashboard, live system health metrics, and API integration guides.
- **Admin Portal**: Platform-wide controls for staff (`is_staff`) and superusers (`is_superuser`) to oversee properties, bookings, and users.

=== 🧠 Intelligent Property Recommendation Engine
- **Scikit-Learn K-Nearest Neighbors (KNN)**: Custom machine learning pipeline standardizing price, ratings, city, and amenities into feature vectors.
- **Jaccard Similarity Fallback**: Text-matching fallback algorithm for fallback property comparisons when vector features are sparse.

=== 💳 Integrated Online Payments & Verification
- **Razorpay Payment Gateway**: Seamless checkout for room deposits and rent payments with backend signature verification.
- **Owner Verification System**: PAN, Aadhar, Bank Account, and IFSC validation for earning verified badges on listings.
===

---

## 🛠️ Technology Stack Overview

| Component | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | High-performance Single Page Application (SPA) |
| **UI & Styling** | Tailwind CSS + Vanilla CSS + shadcn/ui | Modern, responsive visual aesthetics |
| **Icons & Animations** | Lucide React + Framer Motion | Dynamic UI interactions and crisp vector icons |
| **Backend Framework** | Django REST Framework (Python 3.12+) | Robust, decoupled RESTful web API backend |
| **Machine Learning** | Scikit-Learn + NumPy | KNN property recommendation model |
| **Media Storage** | Cloudinary REST API | Cloud image & video upload management |
| **Payment Gateway** | Razorpay REST API | Secure online payment collection & signature validation |
| **Authentication** | Django SimpleJWT | Stateless JSON Web Token role authentication |

---

## 📚 Quick Navigation Guide

[!ref icon="rocket" text="Getting Started Guide"](getting-started/installation.md)
[!ref icon="cpu" text="System Architecture"](architecture/system-overview.md)
[!ref icon="database" text="Database Schemas & Models"](architecture/database-schema.md)
[!ref icon="gear" text="KNN Recommendation Engine"](architecture/knn-recommendations.md)
[!ref icon="people" text="Student Portal"](portals/student-portal.md)
[!ref icon="briefcase" text="Owner Portal"](portals/owner-portal.md)
[!ref icon="code" text="Developer Portal"](portals/developer-portal.md)
[!ref icon="shield-check" text="Admin Portal"](portals/admin-portal.md)
[!ref icon="plug" text="API Reference"](api-reference/auth-endpoints.md)
[!ref icon="cloud" text="Vercel Deployment Guide"](deployment/vercel-deployment.md)
[!ref icon="cloud" text="Render Deployment Guide"](deployment/render-deployment.md)
