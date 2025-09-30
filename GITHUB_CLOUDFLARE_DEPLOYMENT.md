# GitHub and Cloudflare Pages Deployment Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Why GitHub + Cloudflare Pages?](#why-github--cloudflare-pages)
3. [Prerequisites](#prerequisites)
4. [GitHub Setup](#github-setup)
5. [Project Preparation](#project-preparation)
6. [Cloudflare Pages Configuration](#cloudflare-pages-configuration)
7. [Advanced Deployment Options](#advanced-deployment-options)
8. [Custom Domain Setup](#custom-domain-setup)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Monitoring and Analytics](#monitoring-and-analytics)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

## Introduction

This guide will walk you through deploying your Smart Medicine Recommendation System using GitHub for version control and Cloudflare Pages for hosting. This combination provides a powerful, free, and professional-grade hosting solution with automatic deployments, global CDN, and excellent performance.

### What You'll Accomplish
- **Set up GitHub repository** for your project
- **Configure Cloudflare Pages** for automatic deployments
- **Deploy your application** to a global CDN
- **Set up custom domain** (optional)
- **Implement CI/CD pipeline** for automatic updates
- **Monitor performance** and analytics

### Target Audience
- Developers with basic Git knowledge
- Users comfortable with web interfaces
- Anyone wanting free, professional hosting
- Those interested in automated deployment workflows

## Why GitHub + Cloudflare Pages?

### Advantages

#### GitHub Benefits
- **Free Version Control**: Unlimited public repositories
- **Collaboration**: Easy team collaboration
- **Issue Tracking**: Built-in issue and project management
- **Community**: Large developer community
- **Integration**: Integrates with thousands of tools
- **Backup**: Your code is safely backed up

#### Cloudflare Pages Benefits
- **Free Hosting**: No cost for basic hosting
- **Global CDN**: Your site is served from 200+ locations
- **Automatic HTTPS**: Free SSL certificates
- **Continuous Deployment**: Automatic builds on git push
- **High Performance**: Fast loading times worldwide
- **DDoS Protection**: Built-in security
- **Analytics**: Basic analytics included

#### Combined Benefits
- **Zero Cost**: Completely free for most use cases
- **Professional Features**: Enterprise-grade infrastructure
- **Automatic Updates**: Changes deploy automatically
- **Version Control**: Full history of all changes
- **Rollback Capability**: Easy to revert to previous versions
- **Collaboration**: Multiple developers can work together

## Prerequisites

### Before You Start

#### Required Accounts
1. **GitHub Account**: Free at [github.com](https://github.com)
2. **Cloudflare Account**: Free at [cloudflare.com](https://cloudflare.com)
3. **Email Address**: For account verification

#### Required Software
1. **Git**: For version control
   - **Download**: [git-scm.com](https://git-scm.com)
   - **Alternative**: GitHub Desktop (graphical interface)

2. **Text Editor**: For editing files
   - **VS Code**: [code.visualstudio.com](https://code.visualstudio.com)
   - **Sublime Text**: [sublimetext.com](https://sublimetext.com)
   - **Atom**: [atom.io](https://atom.io)

3. **Node.js and npm**: For local development
   - **Download**: [nodejs.org](https://nodejs.org)

#### Required Files
Make sure your project is ready with all necessary files:
```
your-project/
├── public/
│   ├── medicines.json
│   ├── logo.svg
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── components/
├── components.json
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── [all other project files]
```

### Knowledge Requirements
- **Basic Git Knowledge**: Understanding of commit, push, pull
- **Basic Command Line**: Comfortable with terminal commands
- **Web Development**: Understanding of HTML, CSS, JavaScript
- **No Advanced Skills**: This guide is beginner-friendly

## GitHub Setup

### Step 1: Create GitHub Account

#### Registration Process
1. **Go to GitHub**: [github.com](https://github.com)
2. **Click "Sign Up"**: Top-right corner
3. **Fill in Details**:
   - Username (choose carefully, this is your public identity)
   - Email address (use a real email, you'll need to verify)
   - Password (use a strong password)
4. **Verify Email**: Check your email and click the verification link
5. **Complete Profile**: Add a profile picture and bio (optional)

#### Account Verification
- **Email Verification**: Must be completed
- **Phone Verification**: Optional but recommended
- **Two-Factor Authentication**: Highly recommended for security

### Step 2: Install Git

#### Method 1: Command Line Git (Recommended)

##### Windows
1. **Download Git**: [git-scm.com/download/win](https://git-scm.com/download/win)
2. **Run Installer**: Accept default settings
3. **Verify Installation**: Open Command Prompt and type `git --version`

##### macOS
1. **Install Homebrew** (if not installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. **Install Git**:
   ```bash
   brew install git
   ```
3. **Verify Installation**:
   ```bash
   git --version
   ```

##### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
git --version
```

#### Method 2: GitHub Desktop (Graphical)

##### Installation
1. **Download**: [desktop.github.com](https://desktop.github.com)
2. **Install**: Run the installer
3. **Sign In**: Use your GitHub credentials

### Step 3: Configure Git

#### Set Up Your Identity
```bash
# Set your name (use real name for commits)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main
```

#### Verify Configuration
```bash
git config --list
```

### Step 4: Create GitHub Repository

#### Method 1: Web Interface (Easiest)

##### Create Repository
1. **Log in to GitHub**
2. **Click "+"** in top-right corner
3. **Select "New repository"**
4. **Fill in Repository Details**:
   - **Repository name**: `smart-medicine-recommendation` (or your preferred name)
   - **Description**: "Smart Medicine Recommendation System"
   - **Visibility**: Public (free) or Private (paid)
   - **Initialize with README**: ✅ Check this box
   - **Add .gitignore**: Choose "Node"
   - **Add license**: Choose "MIT License" (recommended)
5. **Click "Create repository"**

#### Method 2: Command Line

##### Create Remote Repository
```bash
# Create repository on GitHub first, then:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### Step 5: Prepare Your Project

#### Clean Your Project
```bash
# Remove unnecessary files
rm -rf node_modules
rm -rf .next
rm -rf .cache
rm -rf .DS_Store
rm -rf Thumbs.db
```

#### Create .gitignore File
Create a `.gitignore` file in your project root:
```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
.next/
out/
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
```

#### Initial Commit
```bash
# Add all files to git
git add .

# Make initial commit
git commit -m "Initial commit: Smart Medicine Recommendation System"

# Push to GitHub
git push origin main
```

## Project Preparation

### Step 1: Update package.json

#### Ensure Proper Scripts
Your `package.json` should have these scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next build && next export"
  }
}
```

#### Add Required Dependencies
Ensure you have these dependencies:
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.525.0"
  }
}
```

### Step 2: Configure Next.js for Static Export

#### Update next.config.ts
Create or update `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

#### Update Layout for Static Export
In `src/app/layout.tsx`, ensure proper base path:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Medicine Recommendation System',
  description: 'Find the right medicines for your symptoms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### Step 3: Test Local Build

#### Build Project Locally
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test locally (optional)
npm run start
```

#### Check Output
After building, you should have an `out` folder with:
```
out/
├── index.html
├── medicines.json
├── _next/
├── favicon.ico
└── [other static files]
```

### Step 4: Commit Changes

#### Add Build Configuration
```bash
# Add configuration files
git add next.config.ts
git add package.json
git add src/app/layout.tsx

# Commit changes
git commit -m "Configure for static export"

# Push to GitHub
git push origin main
```

## Cloudflare Pages Configuration

### Step 1: Create Cloudflare Account

#### Registration
1. **Go to Cloudflare**: [cloudflare.com](https://cloudflare.com)
2. **Click "Sign Up"**: Top-right corner
3. **Choose Account Type**: Personal (free)
4. **Fill in Details**:
   - Email address
   - Password
   - Account name
5. **Verify Email**: Check your email and verify

#### Account Setup
- **Complete Profile**: Add your information
- **Verify Domain**: If you have a domain, add it
- **Explore Dashboard**: Familiarize yourself with the interface

### Step 2: Connect to GitHub

#### Method 1: Direct Connection (Recommended)

##### Step 1: Navigate to Pages
1. **Log in to Cloudflare Dashboard**
2. **Find "Pages"** in left sidebar
3. **Click "Pages"**

##### Step 2: Create Project
1. **Click "Create a project"**
2. **Choose "Connect to Git"**
3. **Click "Connect to GitHub"**

##### Step 3: Authorize GitHub
1. **Click "Authorize Cloudflare Pages"**
2. **Log in to GitHub** (if not already logged in)
3. **Grant Permissions**: Cloudflare needs access to your repositories
4. **Click "Authorize"**

#### Method 2: Using GitHub App

##### Install GitHub App
1. **Go to GitHub Marketplace**: [github.com/marketplace](https://github.com/marketplace)
2. **Search for "Cloudflare Pages"**
3. **Click "Configure"**
4. **Choose Repositories**: Select your repository
5. **Install**

### Step 3: Configure Build Settings

#### Basic Configuration

##### Repository Selection
1. **Select Repository**: Choose your medicine recommendation repository
2. **Click "Begin Setup"**

##### Build Configuration
- **Build command**: `npm run build`
- **Build directory**: `out`
- **Root directory**: `/` (leave blank for root)
- **Node.js version**: `18` (or latest)
- **Build environment**: `Linux`

##### Advanced Settings
- **Build command**: `npm run build`
- **Build directory**: `out`
- **Root directory**: `/`
- **Node.js version**: `18`
- **npm version**: `latest`
- **Environment Variables**: (add if needed)
  - `NODE_ENV`: `production`

#### Save and Deploy
1. **Click "Save and Deploy"**
2. **Wait for Build**: Cloudflare will build your project
3. **Check Progress**: Monitor build logs
4. **Success**: Your site will be live!

### Step 4: Configure Custom Domain

#### Method 1: Cloudflare Provided Domain

##### Default Domain
- Cloudflare provides a free domain: `your-project.pages.dev`
- This is immediately available after deployment
- No additional configuration needed

#### Method 2: Custom Domain

##### Add Custom Domain
1. **In Cloudflare Pages Dashboard**
2. **Select your project**
3. **Go to "Custom domains"**
4. **Click "Set up a custom domain"**

##### Domain Configuration
1. **Enter Domain**: `yourdomain.com`
2. **Click "Continue"**
3. **DNS Configuration**: Cloudflare will show DNS records
4. **Update DNS**: Add records to your domain registrar

##### DNS Records to Add
```
Type: CNAME
Name: www
Value: your-project.pages.dev

Type: A
Name: @
Value: 192.0.2.1 (or your IP)
```

##### SSL Certificate
- Cloudflare automatically provisions SSL certificate
- Wait for certificate to be issued (usually 5-15 minutes)
- HTTPS will be enabled automatically

### Step 5: Configure Build Triggers

#### Automatic Builds

##### On Push
- **Default Behavior**: Builds automatically on push to main branch
- **Configuration**: Can be changed in project settings
- **Branch Filtering**: Can build only specific branches

##### Pull Request Builds
- **Preview Deployments**: Automatic preview for pull requests
- **Comments**: Build status appears in PR comments
- **Testing**: Test changes before merging

#### Manual Builds
1. **In Project Dashboard**
2. **Click "Trigger build"**
3. **Choose Branch**: Select branch to build
4. **Click "Trigger build"**

## Advanced Deployment Options

### Step 1: Environment Variables

#### Adding Environment Variables

##### In Cloudflare Dashboard
1. **Go to Project Settings**
2. **Find "Environment Variables"**
3. **Add Variables**:
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - **Environment**: Production

##### Common Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=Smart Medicine Recommendation System
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### Using Variables in Code
```typescript
// Access environment variables
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Medicine App'
const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
```

### Step 2: Custom Build Commands

#### Advanced Build Script

##### Create Custom Build Script
Create `build.sh` in project root:
```bash
#!/bin/bash

# Install dependencies
npm ci

# Run linting
npm run lint

# Build project
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "Build successful!"
    exit 0
else
    echo "Build failed!"
    exit 1
fi
```

##### Make Executable
```bash
chmod +x build.sh
```

##### Update Cloudflare Configuration
- **Build command**: `./build.sh`
- **Build directory**: `out`

### Step 3: Redirects and Rewrites

#### Create _redirects File
In `public` directory, create `_redirects`:
```
# SPA fallback
/*    /index.html   200
```

#### Create netlify.toml (Alternative)
Create `netlify.toml` in project root:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 4: Headers Configuration

#### Custom Headers
Create `public/_headers`:
```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

#### Security Headers
```http
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=()
```

### Step 5: Caching Configuration

#### Browser Caching
Create `public/_headers` with caching:
```
/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.json
  Cache-Control: public, max-age=86400
```

#### CDN Caching
- Cloudflare automatically caches static assets
- Configure cache rules in Cloudflare dashboard
- Set cache TTL for different file types

## Custom Domain Setup

### Step 1: Domain Registration

#### Choose Domain Registrar
- **Cloudflare Registrar**: [registrar.cloudflare.com](https://registrar.cloudflare.com)
- **Namecheap**: [namecheap.com](https://namecheap.com)
- **GoDaddy**: [godaddy.com](https://godaddy.com)
- **Google Domains**: [domains.google](https://domains.google)

#### Register Domain
1. **Search for Domain**: Find available domain
2. **Choose Extension**: .com, .org, .net, etc.
3. **Complete Purchase**: Follow registrar's process
4. **Verify Ownership**: Usually via email

### Step 2: Configure DNS

#### Method 1: Cloudflare Nameservers (Recommended)

##### Update Nameservers
1. **Log in to Domain Registrar**
2. **Find DNS Settings**
3. **Update Nameservers** to:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ns3.cloudflare.com
   ns4.cloudflare.com
   ```

##### Wait for Propagation
- **Time**: 24-48 hours
- **Check**: Use [whatsmydns.net](https://whatsmydns.net) to verify

#### Method 2: CNAME Records

##### Add CNAME Record
1. **In Domain Registrar DNS Settings**
2. **Add CNAME**:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: your-project.pages.dev
   - **TTL**: 1 hour

##### Add A Record (Optional)
1. **Add A Record**:
   - **Type**: A
   - **Name**: @
   - **Value**: 192.0.2.1 (Cloudflare IP)
   - **TTL**: 1 hour

### Step 3: Cloudflare Configuration

#### Add Domain to Cloudflare
1. **Log in to Cloudflare**
2. **Add Site**: Enter your domain
3. **Choose Plan**: Free plan
4. **Continue**: Review DNS records

#### Configure SSL/TLS
1. **Go to SSL/TLS** in Cloudflare dashboard
2. **Choose Mode**: "Full" (recommended)
3. **Always Use HTTPS**: Enable
4. **HSTS**: Enable (optional)

#### Configure Page Rules
1. **Go to Rules** → **Page Rules**
2. **Add Rule**:
   - **URL**: `yourdomain.com/*`
   - **Setting**: "Always Use HTTPS"
   - **Status**: Enabled

### Step 4: Update Cloudflare Pages

#### Connect Custom Domain
1. **In Cloudflare Pages Project**
2. **Go to Custom Domains**
3. **Add Custom Domain**: `yourdomain.com`
4. **Wait**: SSL certificate will be issued automatically

#### Configure Root Domain
1. **Add Root Domain**: `yourdomain.com`
2. **Add WWW Domain**: `www.yourdomain.com`
3. **Redirect**: Configure redirect from non-www to www (or vice versa)

## CI/CD Pipeline

### Step 1: GitHub Actions Setup

#### Create Workflow File
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Lint
      run: npm run lint
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: your-project-name
        directory: out
```

### Step 2: Cloudflare API Token

#### Generate API Token
1. **Log in to Cloudflare Dashboard**
2. **Go to My Profile** → **API Tokens**
3. **Click "Create Token"**
4. **Choose Template**: "Edit Cloudflare Workers"
5. **Configure Permissions**:
   - **Account**: Cloudflare Pages: Edit
   - **Zone**: Zone: Read
6. **Create Token**: Copy the token

#### Add GitHub Secrets
1. **In GitHub Repository**
2. **Go to Settings** → **Secrets and variables** → **Actions**
3. **Add Repository Secrets**:
   - `CLOUDFLARE_API_TOKEN`: Your API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Step 3: Automated Testing

#### Add Test Step
Update `.github/workflows/deploy.yml`:
```yaml
    - name: Test
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      if: github.ref == 'refs/heads/main'
      uses: cloudflare/pages-action@v1
```

#### Add Quality Checks
```yaml
    - name: Check file sizes
      run: |
        echo "Checking build output sizes..."
        du -sh out/*
        
    - name: Security audit
      run: npm audit --audit-level=moderate
```

### Step 4: Deployment Notifications

#### Slack Notification
Add to workflow:
```yaml
    - name: Notify Slack
      if: always()
      uses: rtCamp/action-slack-notify@v2
      env:
        SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
      with:
        status: ${{ job.status }}
        channel: '#deployments'
```

#### Email Notification
Add to workflow:
```yaml
    - name: Send email notification
      uses: dawidd6/action-send-mail@v3
      with:
        server_address: smtp.gmail.com
        server_port: 465
        username: ${{ secrets.EMAIL_USERNAME }}
        password: ${{ secrets.EMAIL_PASSWORD }}
        subject: 'Deploy Status: ${{ job.status }}'
        body: 'Deployment of ${{ github.repository }} completed with status: ${{ job.status }}'
        to: ${{ secrets.NOTIFICATION_EMAIL }}
        from: ${{ secrets.EMAIL_USERNAME }}
```

## Monitoring and Analytics

### Step 1: Cloudflare Analytics

#### Enable Analytics
1. **In Cloudflare Dashboard**
2. **Go to Analytics & Logs**
3. **Enable Traffic Analytics**
4. **Configure Settings**:
   - **Data Collection**: Enable
   - **Retention**: Choose retention period
   - **Sharing**: Configure as needed

#### Key Metrics to Monitor
- **Page Views**: Total visits to your site
- **Unique Visitors**: Individual users
- **Bandwidth**: Data transfer usage
- **Cache Hit Ratio**: CDN efficiency
- **Error Rate**: 4xx/5xx errors
- **Response Time**: How fast your site loads

### Step 2: Google Analytics

#### Set Up Google Analytics
1. **Go to Google Analytics**: [analytics.google.com](https://analytics.google.com)
2. **Create Account**: Set up new account
3. **Create Property**: Add your website
4. **Get Tracking ID**: Copy your GA4 measurement ID

#### Add to Project
Create `public/analytics.js`:
```javascript
// Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'YOUR_MEASUREMENT_ID');
```

Add to `src/app/layout.tsx`:
```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script src="/analytics.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

### Step 3: Performance Monitoring

#### Web Vitals
Add to `src/app/layout.tsx`:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to Google Analytics or your analytics service
  gtag('event', metric.name, {
    value: metric.value,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
  })
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

#### Uptime Monitoring
Set up with external services:
- **UptimeRobot**: [uptimerobot.com](https://uptimerobot.com)
- **Pingdom**: [pingdom.com](https://pingdom.com)
- **StatusCake**: [statuscake.com](https://statuscake.com)

### Step 4: Error Tracking

#### Set Up Error Tracking
1. **Choose Service**: Sentry, Bugsnag, or Rollbar
2. **Create Account**: Get your DSN/API key
3. **Install SDK**: Add to your project

#### Example with Sentry
```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  tracesSampleRate: 1.0,
});
```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Build Fails
**Symptoms**: Build process stops with error messages

**Solutions**:
1. **Check Build Logs**: In Cloudflare Pages dashboard
2. **Local Testing**: Run `npm run build` locally
3. **Check Dependencies**: Ensure all dependencies are in package.json
4. **Fix Code Errors**: Address any TypeScript or JavaScript errors
5. **Update Node.js Version**: Ensure compatible version

#### Issue 2: White Screen After Deployment
**Symptoms**: Page loads but shows blank white screen

**Solutions**:
1. **Check Browser Console**: Press F12 for error messages
2. **Verify File Paths**: Ensure all files are in correct locations
3. **Check Static Assets**: Verify CSS and JS files are loading
4. **Test Different Browsers**: Try Chrome, Firefox, Safari
5. **Clear Browser Cache**: Hard refresh (Ctrl+F5)

#### Issue 3: Routing Not Working
**Symptoms**: Navigation doesn't work, 404 errors

**Solutions**:
1. **Check next.config.ts**: Ensure `trailingSlash: true`
2. **Verify _redirects File**: Check SPA fallback configuration
3. **Test Links**: Ensure all links use correct paths
4. **Check File Structure**: Verify all pages exist
5. **Update Cloudflare Settings**: Check Pages configuration

#### Issue 4: Styles Not Loading
**Symptoms**: Page loads without CSS styling

**Solutions**:
1. **Check CSS Files**: Verify CSS files are in build output
2. **Verify Tailwind Config**: Ensure Tailwind is properly configured
3. **Check Import Paths**: Verify CSS imports in components
4. **Test Locally**: Ensure styles work locally
5. **Clear CDN Cache**: Purge Cloudflare cache

#### Issue 5: Medicine Data Not Loading
**Symptoms**: Medicine recommendations not working

**Solutions**:
1. **Check medicines.json**: Verify file exists and is valid JSON
2. **Test JSON Access**: Try accessing `/medicines.json` directly
3. **Check File Permissions**: Ensure file is readable
4. **Verify Data Structure**: Check JSON format matches expected structure
5. **Monitor Network Tab**: Check browser network requests

### Getting Help

#### Cloudflare Support
- **Documentation**: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Community**: [community.cloudflare.com](https://community.cloudflare.com)
- **Status**: [www.cloudflarestatus.com](https://www.cloudflarestatus.com)

#### GitHub Support
- **Documentation**: [docs.github.com](https://docs.github.com)
- **Community**: [github.community](https://github.community)
- **Status**: [www.githubstatus.com](https://www.githubstatus.com)

#### Community Support
- **Stack Overflow**: [stackoverflow.com](https://stackoverflow.com)
- **Reddit**: [r/webdev](https://www.reddit.com/r/webdev/)
- **Discord**: Various web development communities

## Best Practices

### Development Best Practices

#### Code Quality
1. **Use TypeScript**: Strict type checking
2. **ESLint**: Code linting and formatting
3. **Prettier**: Code formatting
4. **Pre-commit Hooks**: Ensure code quality before commits

#### Performance
1. **Optimize Images**: Compress and resize images
2. **Code Splitting**: Split code into smaller chunks
3. **Lazy Loading**: Load components only when needed
4. **Caching**: Implement proper caching strategies

#### Security
1. **HTTPS**: Always use HTTPS
2. **Content Security Policy**: Implement CSP headers
3. **Input Validation**: Validate all user inputs
4. **Dependency Updates**: Keep dependencies updated

### Deployment Best Practices

#### Build Process
1. **Consistent Environment**: Use same Node.js version locally and in CI
2. **Clean Builds**: Clean build directory before each build
3. **Error Handling**: Handle build errors gracefully
4. **Build Notifications**: Notify on build success/failure

#### Deployment Strategy
1. **Feature Branches**: Use feature branches for development
2. **Pull Requests**: Require PRs for changes
3. **Automated Testing**: Test before deployment
4. **Rollback Strategy**: Have rollback plan ready

#### Monitoring
1. **Uptime Monitoring**: Monitor site availability
2. **Performance Monitoring**: Track load times
3. **Error Tracking**: Monitor application errors
4. **User Analytics**: Track user behavior

### Maintenance Best Practices

#### Regular Updates
1. **Dependencies**: Update dependencies regularly
2. **Security Patches**: Apply security patches promptly
3. **Content Updates**: Keep medicine data current
4. **Feature Updates**: Add new features based on user feedback

#### Backup Strategy
1. **Code Backup**: GitHub provides code backup
2. **Data Backup**: Backup medicine data regularly
3. **Configuration Backup**: Backup configuration files
4. **Recovery Plan**: Have disaster recovery plan

#### Documentation
1. **Code Documentation**: Document complex code
2. **Deployment Documentation**: Keep deployment guides updated
3. **User Documentation**: Provide user guides
4. **Troubleshooting**: Document common issues

---

## Conclusion

You now have a comprehensive deployment setup using GitHub and Cloudflare Pages that provides:

### ✅ What You've Achieved
- **Professional Hosting**: Free, enterprise-grade hosting
- **Automatic Deployments**: Changes deploy automatically on git push
- **Global CDN**: Fast loading times worldwide
- **SSL Security**: Free HTTPS certificates
- **Version Control**: Full Git history of all changes
- **Monitoring**: Analytics and error tracking
- **Custom Domain**: Professional domain setup
- **CI/CD Pipeline**: Automated testing and deployment

### 🚀 Next Steps
1. **Monitor Performance**: Keep an eye on site performance
2. **Gather Feedback**: Collect user feedback
3. **Add Features**: Implement new features based on feedback
4. **Update Content**: Keep medicine information current
5. **Scale**: Consider premium features if needed

### 📈 Success Metrics
- **Site Performance**: Fast loading times
- **User Engagement**: High user interaction
- **Content Accuracy**: Up-to-date medicine information
- **Reliability**: High uptime and availability
- **User Satisfaction**: Positive user feedback

Your Smart Medicine Recommendation System is now professionally hosted and ready to help users find medicine information and recommendations. The combination of GitHub and Cloudflare Pages provides a robust, scalable, and cost-effective solution that will serve your users well.

**Remember**: This is a powerful combination that can handle significant traffic and provides professional features for free. Keep your content updated and monitor performance to ensure continued success!