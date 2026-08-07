---
label: Render Deployment Guide
icon: cloud
order: 870
---

# ☁️ Render Production Deployment Guide

NestNode is configured for seamless deployment to **Render** using standard Web Services and Static Sites defined in `render.yaml`.

---

## 📄 `render.yaml` Blueprint

The project root contains `render.yaml` for infrastructure-as-code deployment on Render:

```yaml
services:
  # 1. Django REST Framework Backend Service
  - type: web
    name: nestnode-backend
    env: python
    region: singapore
    buildCommand: |
      pip install -r backend/requirements.txt
      python backend/manage.py migrate
    startCommand: gunicorn backend.nestnode_backend.wsgi:application --bind 0.0.0.0:$PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.12.0
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: "False"

  # 2. Vite React Frontend Static Site
  - type: static
    name: nestnode-frontend
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## 🚀 Deployment Steps

1. **Push Code**: Push your repository to GitHub / GitLab.
2. **Connect to Render**: Log into [Render Dashboard](https://dashboard.render.com/) and select **New + -> Blueprint**.
3. **Select Repository**: Select `dwarkesh777/SEM4_GP`.
4. **Environment Variables**: Fill in secrets for Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), Razorpay (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`), and SMTP credentials.
5. **Deploy**: Render will automatically build the backend service, execute Django migrations, compile Vite frontend dist assets, and issue SSL certificates.
