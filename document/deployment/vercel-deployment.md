---
label: Vercel Deployment Guide
icon: cloud
order: 860
---

# 📐 Deploying Documentation to Vercel

You can host your Retype documentation website for free on **Vercel** with automatic deployment whenever you push changes to GitHub.

---

## 🛠️ Step-by-Step Vercel Deployment Guide

### Step 1: Push Changes to GitHub
Ensure all your files inside the `document/` directory (including `retype.yml`, `package.json`, and all `.md` files) are committed and pushed to GitHub:

```bash
git add document/
git commit -m "Add Retype project documentation and Vercel setup"
git push origin main
```

---

### Step 2: Import Project in Vercel
1. Log into your **[Vercel Dashboard](https://vercel.com/new)**.
2. Click **Add New... -> Project**.
3. Import your GitHub repository (`SEM4_GP` or your repository name).

---

### Step 3: Configure Vercel Project Settings
Before clicking Deploy, set the project configuration as follows:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Other` |
| **Root Directory** | `document` |
| **Build Command** | `npm run build` *(or `npx retypeapp build`)* |
| **Output Directory** | `.retype` |

---

### Step 4: Deploy & View Live Site
Click **Deploy**. Vercel will:
1. Install `retypeapp`.
2. Build the static documentation website from your `.md` files into `.retype`.
3. Provide you with a free SSL live URL (e.g. `https://nestnode-docs.vercel.app`).

---

## 🔄 Automatic Continuous Deployment (CI/CD)
Every time you update or add a new `.md` file inside the `document/` directory and push to GitHub, Vercel will automatically rebuild and update your live documentation site instantly!
