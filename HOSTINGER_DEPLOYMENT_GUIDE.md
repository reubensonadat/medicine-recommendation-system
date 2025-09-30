# Hostinger Deployment Guide - Smart Medicine Recommendation System

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Hostinger Setup](#hostinger-setup)
4. [File Upload Methods](#file-upload-methods)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Domain Configuration](#domain-configuration)
7. [SSL Certificate Setup](#ssl-certificate-setup)
8. [Testing and Verification](#testing-and-verification)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance](#maintenance)

## Introduction

This guide will walk you through deploying the Smart Medicine Recommendation System on Hostinger hosting services. Hostinger is an affordable and user-friendly hosting platform perfect for deploying static websites and applications like this medicine recommendation system.

### Why Hostinger?
- **Affordable**: Plans start at $2.99/month
- **Easy to Use**: User-friendly control panel
- **Good Performance**: Fast loading times
- **24/7 Support**: Live chat support available
- **Free Domain**: Comes with annual plans

## Prerequisites

### Before You Start
1. **Hostinger Account**: Sign up at [hostinger.com](https://www.hostinger.com)
2. **Domain Name**: Either register a new domain or use an existing one
3. **Your Application Files**: All files from your project folder
4. **About 30 Minutes**: Time needed for complete setup

### Required Files
Make sure you have all these files ready:
```
├── public/
│   ├── medicines.json          # Medicine database
│   ├── logo.svg                # Application logo
│   └── robots.txt             # SEO configuration
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main application
│   │   ├── layout.tsx         # Root layout
│   │   └── medicine/          # Medicine details
│   └── components/            # All components
├── components.json           # shadcn/ui config
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── All other project files
```

## Hostinger Setup

### Step 1: Choose Your Hosting Plan

#### Recommended Plans for This App
1. **Single Web Hosting** ($2.99/month)
   - 1 Website
   - 50 GB SSD Storage
   - 100 GB Bandwidth
   - Free Email Account
   - Perfect for small to medium apps

2. **Premium Web Hosting** ($7.99/month)
   - 100 Websites
   - 100 GB SSD Storage
   - Unlimited Bandwidth
   - Free Domain
   - Good for multiple projects

3. **Business Web Hosting** ($15.99/month)
   - 100 Websites
   - 200 GB SSD Storage
   - Unlimited Bandwidth
   - Free Domain
   - Daily Backups
   - Best for business use

### Step 2: Register and Set Up

#### Creating Your Account
1. Go to [hostinger.com](https://www.hostinger.com)
2. Click "Get Started"
3. Choose your preferred plan
4. Select your domain (new or existing)
5. Create your account with email and password
6. Complete the payment process

#### Initial Setup
1. **Check Email**: You'll receive a confirmation email
2. **Verify Account**: Click the verification link
3. **Log In**: Access your Hostinger control panel
4. **Setup Wizard**: Follow the initial setup wizard

## File Upload Methods

### Method 1: Hostinger File Manager (Easiest)

#### Accessing File Manager
1. **Log In**: Go to your Hostinger control panel
2. **Navigate**: Find "Hosting" → "Manage" → "File Manager"
3. **Location**: You'll see the `public_html` folder

#### Uploading Files
1. **Open public_html**: This is your website's root directory
2. **Clean Up**: Remove any existing files (if it's a fresh account)
3. **Upload Files**: 
   - Click "Upload" button
   - Select all your project files
   - Wait for upload to complete
4. **Organize**: Make sure the folder structure matches your local setup

### Method 2: FTP (Faster for Large Projects)

#### Setting Up FTP
1. **Get FTP Details**: In Hostinger control panel
   - Go to "Hosting" → "Manage" → "FTP Accounts"
   - Note your FTP hostname, username, and password

2. **Download FTP Client**: 
   - **FileZilla** (Free): [filezilla-project.org](https://filezilla-project.org)
   - **Cyberduck** (Free): [cyberduck.io](https://cyberduck.io)
   - **WinSCP** (Free): [winscp.net](https://winscp.net)

#### Connecting via FTP
1. **Open FTP Client**: Launch FileZilla or your preferred client
2. **Enter Details**:
   - **Host**: Your FTP hostname (e.g., `ftp.yourdomain.com`)
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21 (default)
3. **Connect**: Click "Connect"
4. **Navigate**: Go to `public_html` folder
5. **Upload**: Drag and drop your project files

### Method 3: Hostinger Website Builder (Alternative)

#### Using the Builder
1. **Access Builder**: In control panel, go to "Website Builder"
2. **Choose Template**: Select a blank template
3. **Add Custom Code**: Use the "Add HTML" feature
4. **Upload Files**: Use the file upload feature
5. **Publish**: Make your site live

## Step-by-Step Deployment

### Phase 1: Preparation

#### 1. Prepare Your Files
```bash
# On your local machine, organize your files
project-folder/
├── public/
├── src/
├── components.json
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── [all other files]
```

#### 2. Build Your Application (Optional)
```bash
# If you want to optimize for production
npm run build
```

#### 3. Test Locally
```bash
# Make sure everything works locally
npm run dev
```

### Phase 2: Upload to Hostinger

#### Using File Manager
1. **Log in to Hostinger**
2. **Go to File Manager**
3. **Navigate to public_html**
4. **Upload all files**:
   - Select all files and folders
   - Click "Upload"
   - Wait for completion

#### Using FTP
1. **Connect to FTP server**
2. **Navigate to public_html**
3. **Upload entire project folder**
4. **Verify all files are uploaded**

### Phase 3: Configuration

#### 1. Check File Permissions
- **Files**: Should be 644 (readable by everyone, writable by owner)
- **Folders**: Should be 755 (readable/executable by everyone, writable by owner)

#### 2. Verify File Structure
Your Hostinger `public_html` should look like:
```
public_html/
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
└── package.json
```

#### 3. Set Up .htaccess (Optional)
Create a `.htaccess` file in `public_html`:
```apache
# Enable URL rewriting
RewriteEngine On

# Handle Next.js routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Set default character set
AddDefaultCharset UTF-8

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## Domain Configuration

### Setting Up Your Domain

#### If You Registered a New Domain
1. **Domain Should Be Active**: Usually takes 24-48 hours
2. **DNS Configuration**: Hostinger handles this automatically
3. **Propagation**: Wait for DNS to propagate (can take up to 48 hours)

#### If You're Using an Existing Domain
1. **Update Nameservers**:
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Change nameservers to Hostinger's:
     - NS1.HOSTINGER.COM
     - NS2.HOSTINGER.COM
     - NS3.HOSTINGER.COM
     - NS4.HOSTINGER.COM

2. **Wait for Propagation**: Can take 24-48 hours

#### Subdomain Setup (Optional)
1. **Create Subdomain**: In Hostinger control panel
   - Go to "Domains" → "Subdomains"
   - Add your subdomain (e.g., `medicines.yourdomain.com`)
2. **Upload Files**: Upload your app to the subdomain folder

## SSL Certificate Setup

### Why SSL is Important
- **Security**: Encrypts data between user and server
- **Trust**: Shows padlock icon in browser
- **SEO**: Google prefers HTTPS sites
- **Compliance**: Many regulations require HTTPS

### Setting Up Free SSL with Hostinger

#### Method 1: Auto-Install (Recommended)
1. **Go to SSL Section**: In Hostinger control panel
2. **Navigate**: "SSL" → "Let's Encrypt SSL"
3. **Select Domain**: Choose your domain
4. **Install**: Click "Install SSL Certificate"
5. **Wait**: Installation takes a few minutes

#### Method 2: Manual Install
1. **Generate CSR**: In SSL section, generate Certificate Signing Request
2. **Complete SSL**: Follow the verification process
3. **Install Certificate**: Upload the certificate files

#### Forcing HTTPS
Add this to your `.htaccess` file:
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Testing and Verification

### Phase 1: Basic Testing

#### 1. Access Your Website
- Open your browser
- Go to `https://yourdomain.com`
- Check if the app loads

#### 2. Test Functionality
- **Symptom Selection**: Try selecting symptoms
- **Severity Adjustment**: Change severity levels
- **Recommendation Generation**: Click "Find Medicines"
- **Medicine Details**: Click on medicine cards

#### 3. Check All Pages
- **Home Page**: Main application interface
- **Medicine Details**: Individual medicine pages
- **All Links**: Verify all navigation works

### Phase 2: Advanced Testing

#### 1. Browser Compatibility
- **Chrome**: Should work perfectly
- **Firefox**: Should work perfectly
- **Safari**: Should work perfectly
- **Edge**: Should work perfectly
- **Mobile**: Test on iOS and Android

#### 2. Performance Testing
- **Load Time**: Should be under 3 seconds
- **Mobile Performance**: Should be fast on mobile
- **All Features**: Should work without errors

#### 3. SEO and Analytics
- **Meta Tags**: Check if they're working
- **Sitemap**: Verify `robots.txt` is accessible
- **Google Indexing**: Check if Google can find your site

### Phase 3: User Testing

#### 1. Test with Real Users
- **Friends/Family**: Ask them to try the app
- **Colleagues**: Get feedback from people in your field
- **Target Audience**: Test with people who might actually use it

#### 2. Collect Feedback
- **Usability**: Is it easy to use?
- **Functionality**: Does everything work as expected?
- **Design**: Does it look good?
- **Performance**: Is it fast enough?

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: White Screen or Blank Page
**Possible Causes:**
- Missing files
- Incorrect file paths
- JavaScript errors

**Solutions:**
1. **Check Browser Console**: Press F12, look for errors
2. **Verify All Files**: Make sure all files are uploaded
3. **Check File Paths**: Ensure paths are correct
4. **Clear Browser Cache**: Try hard refresh (Ctrl+F5)

#### Issue 2: Styles Not Loading
**Possible Causes:**
- CSS files missing
- Incorrect CSS paths
- Tailwind CSS not working

**Solutions:**
1. **Check CSS Files**: Verify CSS files are uploaded
2. **Verify Tailwind**: Make sure Tailwind is configured
3. **Check Browser Network Tab**: See if CSS files are loading
4. **Re-upload CSS Files**: Try uploading CSS files again

#### Issue 3: Medicine Data Not Loading
**Possible Causes:**
- `medicines.json` missing
- JSON syntax errors
- File permissions wrong

**Solutions:**
1. **Check medicines.json**: Verify it exists and is accessible
2. **Validate JSON**: Use a JSON validator to check syntax
3. **Check File Permissions**: Ensure file is readable (644)
4. **Test JSON Access**: Try accessing `yourdomain.com/medicines.json`

#### Issue 4: Recommendations Not Working
**Possible Causes:**
- JavaScript errors
- Missing symptom mappings
- Algorithm issues

**Solutions:**
1. **Check Console**: Look for JavaScript errors
2. **Verify Symptoms**: Make sure symptom data is correct
3. **Test Algorithm**: Check if recommendation logic works
4. **Debug Step by Step**: Use browser developer tools

#### Issue 5: Mobile Responsiveness Issues
**Possible Causes:**
- Missing viewport meta tag
- CSS not optimized for mobile
- Touch events not working

**Solutions:**
1. **Check Viewport**: Ensure proper viewport meta tag
2. **Test on Real Devices**: Use actual mobile devices
3. **Check CSS Media Queries**: Verify responsive CSS
4. **Test Touch Events**: Make sure buttons work on mobile

### Getting Help from Hostinger

#### Contact Support
1. **Live Chat**: Available 24/7 in Hostinger control panel
2. **Email Support**: Send detailed description of your issue
3. **Knowledge Base**: Check Hostinger's help articles

#### What to Tell Support
- **Your Domain**: Your website address
- **Issue Description**: What exactly is wrong
- **Steps to Reproduce**: How to see the problem
- **Browser and Device**: What you're using
- **Error Messages**: Any error messages you see

## Maintenance

### Regular Maintenance Tasks

#### Weekly
- **Check Website**: Make sure it's still working
- **Monitor Performance**: Check load times
- **Review Analytics**: See how people are using your site

#### Monthly
- **Update Content**: Add new medicines if needed
- **Check for Issues**: Look for any problems
- **Backup Files**: Keep a backup of your files

#### Quarterly
- **Review Analytics**: Analyze usage patterns
- **Update Design**: Consider design improvements
- **Plan New Features**: Think about what to add next

### Updating Your Application

#### Adding New Medicines
1. **Edit medicines.json**: Add new medicine data
2. **Test Locally**: Make sure it works
3. **Upload to Hostinger**: Replace the file
4. **Test Online**: Verify it works on live site

#### Updating the Design
1. **Make Changes**: Edit CSS and component files
2. **Test Locally**: Ensure everything works
3. **Upload Changes**: Replace files on Hostinger
4. **Clear Cache**: Clear browser cache to see changes

#### Adding New Features
1. **Plan Feature**: Decide what to add
2. **Develop Locally**: Create and test the feature
3. **Test Thoroughly**: Make sure it works perfectly
4. **Deploy to Hostinger**: Upload new files
5. **Monitor**: Watch for any issues

### Backup and Recovery

#### Creating Backups
1. **Download Files**: Regularly download all files from Hostinger
2. **Local Backup**: Keep copies on your computer
3. **Version Control**: Use Git to track changes
4. **Hostinger Backup**: Enable Hostinger's backup service

#### Recovery Process
1. **Identify Issue**: What went wrong
2. **Restore Files**: Upload backup files
3. **Test**: Make sure everything works
4. **Monitor**: Watch for any remaining issues

### Performance Optimization

#### Speed Optimization
1. **Optimize Images**: Compress images if you add any
2. **Minify CSS/JS**: Reduce file sizes
3. **Enable Caching**: Use browser caching
4. **CDN**: Consider using a CDN for faster loading

#### SEO Optimization
1. **Meta Tags**: Ensure proper meta tags
2. **Structured Data**: Add schema markup
3. **Sitemap**: Create and submit sitemap
4. **Mobile Optimization**: Ensure mobile-friendliness

---

## Conclusion

Deploying your Smart Medicine Recommendation System on Hostinger is straightforward when you follow this guide. The process involves:

1. **Preparing your files**
2. **Uploading to Hostinger**
3. **Configuring your domain**
4. **Setting up SSL**
5. **Testing everything**
6. **Maintaining your site**

With Hostinger's affordable pricing and user-friendly interface, you can have your medicine recommendation app live and accessible to users worldwide in no time.

Remember to:
- **Test thoroughly** before and after deployment
- **Keep backups** of your files
- **Monitor performance** regularly
- **Update content** as needed
- **Provide support** to your users

Your app is now ready to help people find medicine information and make informed decisions about their health!

---

**Need Help?**
- **Hostinger Support**: 24/7 live chat in your control panel
- **Technical Issues**: Contact Hostinger's technical team
- **Medical Questions**: Always consult healthcare professionals
- **Customization Help**: Consider hiring a web developer for complex changes