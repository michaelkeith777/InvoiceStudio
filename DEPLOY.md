# Netlify Deployment Guide

## Quick Deploy to Netlify

### Option 1: Drag & Drop (Fastest)
1. Run the build: `npx webpack --mode production`
2. Upload the entire `build/` folder to Netlify manually
3. Your app will be live immediately

### Option 2: Git Repository (Recommended)
1. **Push to GitHub/GitLab**:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

3. **Build Settings** (Auto-detected from netlify.toml):
   - **Build command**: `npx webpack --mode production`
   - **Publish directory**: `build`
   - **Node version**: 20

4. **Deploy**: Click "Deploy site"

## Files Created for Netlify

- ✅ `netlify.toml` - Build configuration and redirects
- ✅ `_redirects` - Client-side routing support
- ✅ `index.html` - Moved to main folder (not subfolder)
- ✅ `build/` - Production build output
- ✅ Optimized webpack config for static hosting

## Features Working on Netlify

- ✅ Single Page Application routing
- ✅ Real-time invoice preview
- ✅ Browser-based data storage
- ✅ PDF export functionality
- ✅ Responsive design
- ✅ Micro-animations
- ✅ Professional templates

## Build Output

The `build/` directory contains:
```
build/
├── index.html
├── _redirects
└── static/
    ├── js/
    │   ├── main.[hash].js
    │   ├── vendors.[hash].js
    │   └── runtime.[hash].js
    └── css/
        └── main.[hash].css
```

## Custom Domain (Optional)

After deployment, you can:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Netlify will automatically handle HTTPS

## Environment Variables

This app runs entirely client-side with no backend dependencies, so no environment variables are needed for basic functionality.

If you add payment processing or external APIs later, add them in:
- Netlify Dashboard → Site settings → Environment variables

## Troubleshooting

**404 errors on page refresh?**
- The `_redirects` file should handle this automatically
- Ensure `netlify.toml` redirects are configured correctly

**Build failing?**
- Check Node version is set to 20 in netlify.toml
- Verify all dependencies are in package.json
- Review build logs for specific errors

**Assets not loading?**
- Webpack is configured with proper publicPath: '/'
- Static assets are in the build/static/ directory