---
label: Environment Variables
icon: key
order: 980
---

# 🔑 Environment Variables Configuration

NestNode uses environment variables to manage secret keys, database credentials, payment gateways, and Cloudinary settings.

---

## Backend `.env` Configuration

Create a `.env` file inside the `backend/` directory:

```env
# Django Core Settings
SECRET_KEY=your_django_secret_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# Database Configuration (Optional - Defaults to SQLite)
# DATABASE_URL=postgres://user:password@localhost:5432/nestnodedb

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Email SMTP Settings (For OTP & Email Notifications)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

---

## Frontend `.env` Configuration

Create a `.env` file inside the `frontend/` directory:

```env
# API Base Endpoint URL
VITE_API_URL=http://127.0.0.1:8000

# Razorpay Client Key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
```

---

## 🔒 Security Best Practices

1. **Never Commit Secrets**: Ensure `.env` is listed in `.gitignore` for both frontend and backend directories.
2. **Production Keys**: Always replace test keys (`rzp_test_...`) with production credentials when deploying to Render or AWS.
3. **App Passwords**: For Gmail SMTP, generate an App Password from your Google Security Settings instead of using your primary account password.
