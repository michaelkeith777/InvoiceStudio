# Deployment Configuration

This document outlines the deployment fixes applied to resolve the Cloud Run deployment issues.

## Issues Fixed

1. **Missing deployment section in .replit file** - Created alternative deployment configuration files
2. **Generic error in run command** - Added proper production server commands
3. **Incomplete deployment configuration** - Added comprehensive deployment setup

## Deployment Files Created

### 1. Production Server Scripts
- `start.sh` - Main production startup script using Node.js/Express
- `start_serve.sh` - Alternative startup script using serve package  
- `server.js` - Express server for serving static files

### 2. Configuration Files
- `replit_deploy.toml` - Replit deployment configuration
- `deploy.json` - JSON deployment configuration
- `Dockerfile` - Container configuration for Cloud Run

### 3. Dependencies Added
- `serve` - Static file server package
- `express` - Node.js web server framework

## Deployment Options

### Option 1: Express Server (Recommended)
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Serve Package
```bash
chmod +x start_serve.sh
./start_serve.sh
```

### Option 3: Direct Commands
```bash
# Build
npx webpack --mode production

# Serve with Express
node server.js

# OR serve with serve package
serve -s build -l 5000 --host 0.0.0.0
```

## Configuration Details

### Port Configuration
- Production server listens on port 5000
- Uses 0.0.0.0 host for external access
- Supports environment variable PORT override

### Build Process
- Webpack builds to `build/` directory
- Production mode with optimizations enabled
- Static assets properly handled

### Deployment Target
- Configured for Google Cloud Run
- Container-ready with Dockerfile
- Environment variables supported

## Testing Deployment

1. **Local Testing:**
   ```bash
   npx webpack --mode production
   node server.js
   ```

2. **Container Testing:**
   ```bash
   docker build -t invoice-app .
   docker run -p 5000:5000 invoice-app
   ```

## Environment Variables

- `NODE_ENV=production` - Set production mode
- `PORT=5000` - Server port (default: 5000)

## Next Steps

The deployment configuration is now complete. The Replit deployment system should be able to:

1. Build the application using webpack
2. Start the production server
3. Serve the application on the configured port
4. Handle routing for the React single-page application

To deploy, use the Deploy button in the Replit interface, which will now have access to the proper configuration files and startup scripts.