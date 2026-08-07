---
label: Installation & Setup
icon: rocket
order: 990
---

# 🚀 Installation & Local Setup Guide

Follow this guide to get NestNode running locally on your workstation for both development and testing.

---

## 📋 Prerequisites

Before starting, ensure you have the following tools installed on your system:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Python** (v3.10, 3.11, or 3.12)
- **Git**

---

## 1. Repository Setup

Clone the repository to your local machine:

```bash
git clone https://github.com/dwarkesh777/SEM4_GP.git
cd SEM4_GP
```

---

## 2. Backend Setup (Django REST Framework)

### A. Navigate to backend directory
```bash
cd backend
```

### B. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### C. Install Dependencies
```bash
pip install -r requirements.txt
```

### D. Apply Database Migrations
```bash
python manage.py migrate
```

### E. Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
```

### F. Run Backend Development Server
```bash
python manage.py runserver
```
The Django REST API backend server will start at `http://127.0.0.1:8000/`.

---

## 3. Frontend Setup (React + Vite)

Open a new terminal window in the root directory.

### A. Navigate to frontend directory
```bash
cd frontend
```

### B. Install Node Packages
```bash
npm install
```

### C. Start Development Server
```bash
npm run dev
```
The React frontend application will launch at `http://localhost:8080/` (or `http://localhost:5173/`).

---

## 4. Verification

1. Open `http://localhost:8080/` in your browser. You should see the NestNode home page.
2. Log in using your Superuser credentials or create a new Student/Owner/Developer account.
3. Access API endpoints at `http://127.0.0.1:8000/api/properties/`.
