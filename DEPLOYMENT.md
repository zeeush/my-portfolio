# Deployment Guide: GitHub & Vercel Automated Deployments

This guide provides clear, step-by-step instructions for pushing this Next.js project to GitHub, deploying it on Vercel with automated CI/CD, and leveraging the Next.js `output: 'standalone'` configuration for production environments.

---

## Table of Contents

1. [Architecture & Standalone Output Overview](#1-architecture--standalone-output-overview)
2. [Prerequisites](#2-prerequisites)
3. [Step 1: Push Code to GitHub](#3-step-1-push-code-to-github)
4. [Step 2: Deploy to Vercel](#4-step-2-deploy-to-vercel)
5. [Step 3: Environment Variables Configuration](#5-step-3-environment-variables-configuration)
6. [Step 4: Automated CI/CD Workflow](#6-step-4-automated-cicd-workflow)
7. [Step 5: Standalone Mode for Docker & Self-Hosted Environments](#7-step-5-standalone-mode-for-docker--self-hosted-environments)
8. [Troubleshooting & Verification](#8-troubleshooting--verification)

---

## 1. Architecture & Standalone Output Overview

This application is built with:
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Phosphor Icons & Lucide React
- **Animations**: Framer Motion

### Why `output: "standalone"`?

In `next.config.ts`, the build is configured with `output: "standalone"`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // ...
};

export default nextConfig;
```

#### How It Works:
1. **Automatic Dependency Tracing**: During `next build`, Next.js analyzes your imports and generates a minimal `.next/standalone` directory.
2. **Reduced Bundle Size**: Only the specific `node_modules` required for production are included, shrinking deployment artifacts from 500MB+ down to ~50–80MB.
3. **Dual Deployment Compatibility**:
   - **On Vercel**: Vercel automatically detects Next.js and deploys serverless and edge functions with zero extra configuration.
   - **On Docker / Cloud Run / VPS**: It produces a lightweight, self-contained `server.js` file that can be executed without installing the full `node_modules` directory in production.

---

## 2. Prerequisites

Before starting, ensure you have:
- [Git](https://git-scm.com/) installed on your machine (`git --version`)
- A [GitHub](https://github.com/) account
- A [Vercel](https://vercel.com/) account (sign up using your GitHub account for easiest integration)
- Node.js 20+ installed locally

---

## 3. Step 1: Push Code to GitHub

### 1. Verify Git Status & Ignore Files
Check that your `.gitignore` file includes sensitive files and build artifacts:
```bash
# Ensure .env and build directories are ignored
node_modules/
.next/
.env*
!.env.example
```

### 2. Initialize Git Repository
In your local project root directory, run:

```bash
# Initialize git if not already initialized
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: complete portfolio app with standalone next.config"
```

### 3. Create a New Repository on GitHub
1. Open [GitHub](https://github.com/new).
2. Enter a **Repository name** (e.g. `designer-portfolio` or `zeeshan-portfolio`).
3. Set visibility to **Public** or **Private**.
4. **Do not** check "Initialize this repository with a README" (the project already has local files).
5. Click **Create repository**.

### 4. Link Remote and Push Code
Replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPOSITORY_NAME>` with your repository details:

```bash
# Ensure default branch is main
git branch -M main

# Add the GitHub remote URL
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# Push code to GitHub
git push -u origin main
```

---

## 4. Step 2: Deploy to Vercel

### 1. Import Repository into Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click the **"Add New..."** button in the top right and select **"Project"**.
3. Under **"Import Git Repository"**, locate your GitHub repository and click **"Import"**.

### 2. Configure Build & Output Settings
Vercel automatically detects Next.js with sensible defaults:
- **Framework Preset**: `Next.js`
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build` (or default `next build`)
- **Output Directory**: `.next` (automatically resolved)
- **Install Command**: `npm install`

---

## 5. Step 3: Environment Variables Configuration

In the Vercel project configuration screen, open the **Environment Variables** section and configure your keys from `.env.example`:

| Key | Description | Example / Recommended Value |
|---|---|---|
| `ADMIN_PASSWORD` | Password used to log in to the `/admin` portal | `AStrongAndSecurePassword2026!` |
| `ADMIN_AUTH_SECRET` | Secret token used to sign admin session cookies | Generate via `openssl rand -hex 32` |

> **Pro Tip**: Generate a cryptographically secure secret locally with:
> ```bash
> openssl rand -hex 32
> ```

Select **Production**, **Preview**, and **Development** environments, then click **Add**.

Finally, click **"Deploy"**. Vercel will build and deploy your application in under 2 minutes.

---

## 6. Step 4: Automated CI/CD Workflow

Once connected to GitHub, Vercel sets up a continuous deployment pipeline automatically:

### Production Deployments
- Every push to the `main` branch immediately triggers a **Production Deployment**.
- The production deployment is published directly to your live URL (and custom domain).

### Preview Deployments (Pull Requests & Feature Branches)
- Pushing to any branch other than `main` or opening a Pull Request creates an isolated **Preview Deployment**.
- A unique preview URL is automatically commented on your PR for visual review before merging.

### Connecting a Custom Domain
1. In the Vercel Dashboard, go to your project **Settings > Domains**.
2. Enter your custom domain (e.g., `zeeshan.design` or `www.yourdomain.com`).
3. Follow the DNS instructions provided by Vercel:
   - **Apex domain (`example.com`)**: Add an `A` record pointing to `76.76.21.21`
   - **Subdomain (`www.example.com`)**: Add a `CNAME` record pointing to `cname.vercel-dns.com`
4. SSL certificates are provisioned automatically via Let's Encrypt.

---

## 7. Step 5: Standalone Mode for Docker & Self-Hosted Environments

If you also wish to deploy the standalone build to a containerized platform (such as Google Cloud Run, AWS ECS, DigitalOcean App Platform, or a self-hosted VPS), use the following multi-stage `Dockerfile`:

```dockerfile
# 1. Base image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 4. Production Runner using Standalone Output
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and public directory
COPY --from=builder /app/public ./public

# Automatically leverage standalone output traces
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

### Running the Docker Container:
```bash
# Build Docker image
docker build -t portfolio-app .

# Run Docker container
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD="your-secure-password" \
  -e ADMIN_AUTH_SECRET="your-auth-secret" \
  portfolio-app
```

---

## 8. Troubleshooting & Verification

### Local Build Verification
Before pushing to GitHub, you can test the production build locally:

```bash
# 1. Verify code formatting and linting
npm run lint

# 2. Run the Next.js production build
npm run build

# 3. Verify that the standalone directory was generated
ls -la .next/standalone

# 4. Test production runtime locally
npm run start
```

### Common Issues & Solutions

1. **Missing Static Files or Images on Docker**:
   - Ensure you copy both `public` to `./public` and `.next/static` to `./.next/static` as shown in the Dockerfile runner stage.

2. **Environment Variables Not Available at Runtime**:
   - In Vercel, verify that environment variables are assigned to the **Production** environment.
   - Remember to redeploy after updating environment variables (`Deployments > ... > Redeploy`).

3. **Stale Vercel Build Cache**:
   - Go to your deployment in Vercel, click **Redeploy**, and select **"Clear Build Cache and Redeploy"**.

---

*Your repository is now fully configured for automated GitHub pushes and instant Vercel deployments!*
