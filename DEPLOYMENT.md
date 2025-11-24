# Vercel Deployment Guide

This portfolio is configured to deploy to Vercel with both the static Hugo site and the contact API serverless function.

## 🚀 Quick Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Hugo configuration
   - Add environment variables:
     - `EMAIL_USER` = your Gmail address
     - `EMAIL_APP_PASSWORD` = your Gmail app password
   - Click "Deploy"

## 📋 Environment Variables

Set these in Vercel Dashboard (Settings → Environment Variables):

```
EMAIL_USER=your.email@gmail.com
EMAIL_APP_PASSWORD=your-16-char-app-password
```

## 🔧 How It Works

- **Hugo Site**: Builds to `/public` directory (static files)
- **API Function**: `/api/contact.js` runs as serverless function
- **URL**: Your site will be at `https://your-project.vercel.app`
- **API Endpoint**: `https://your-project.vercel.app/api/contact`

## 📁 File Structure

```
portfolio-v1/
├── api/
│   └── contact.js          # Serverless function
├── content/                # Hugo content
├── layouts/                # Hugo templates
├── static/                 # Static assets
├── public/                 # Built site (auto-generated)
├── vercel.json            # Vercel configuration
└── hugo.toml              # Hugo configuration
```

## ✅ What's Included

- ✅ Static Hugo site hosting
- ✅ Serverless contact form API
- ✅ Automatic HTTPS
- ✅ CDN distribution
- ✅ Auto-deploy on Git push
- ✅ Preview deployments for branches

## 🔄 Local Development

Hugo site:
```bash
hugo server -D
```

Test serverless function locally with Vercel CLI:
```bash
npm install -g vercel
vercel dev
```

## 📝 Notes

- The old `api/contact-server.js` is for local development only
- The new `api/contact.js` is the serverless version for Vercel
- Both work with the same environment variables
- The contact form automatically uses `/api/contact` (relative URL)
