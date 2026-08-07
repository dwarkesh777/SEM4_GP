---
label: Authentication API
icon: plug
order: 900
---

# 🔐 Authentication API Reference

NestNode uses JWT (JSON Web Tokens) for authentication via Django SimpleJWT. Below are the key authentication endpoints.

---

## 1. Student / General Token Login

```http
POST /api/auth/token/
```

**Request Body:**
```json
{
  "email": "student@gmail.com",
  "password": "SecretPassword123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1Ni...",
  "refresh": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": 1,
    "email": "student@gmail.com",
    "full_name": "John Student",
    "is_owner": false,
    "is_developer": false,
    "is_staff": false
  }
}
```

---

## 2. Developer Login

```http
POST /api/auth/developer/login/
```

**Request Body:**
```json
{
  "email": "dev@company.com",
  "password": "DevPassword123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1Ni...",
  "refresh": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": 5,
    "email": "dev@company.com",
    "is_developer": true
  }
}
```

---

## 3. Developer Signup

```http
POST /api/auth/developer/signup/
```

**Request Body:**
```json
{
  "email": "dev@company.com",
  "password": "DevPassword123",
  "full_name": "Developer Name"
}
```

---

## 4. Send OTP Password Reset Email

```http
POST /api/auth/otp/send/
```

**Request Body:**
```json
{
  "email": "user@gmail.com"
}
```

**Response (200 OK):**
```json
{
  "message": "OTP sent successfully to email"
}
```

---

## 5. Verify OTP & Reset Password

```http
POST /api/auth/otp/verify/
```

**Request Body:**
```json
{
  "email": "user@gmail.com",
  "otp": "492815",
  "new_password": "NewSecretPassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
```
