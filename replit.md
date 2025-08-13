# Invoice Studio Pro

## Overview

Invoice Studio Pro is a professional web-based invoice application built with React for generating invoices with real-time preview. The application provides a complete invoicing solution with template-based customization, tax/fee management, and browser-based PDF export. It features a three-pane interface with form inputs on the left and live invoice preview on the center, updating instantly as users type.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript for type safety and modern component development
- **State Management**: Zustand for global state management, providing a simple and performant alternative to Redux
- **Styling**: Tailwind CSS with custom component classes and utility-first approach
- **UI Layout**: Three-pane desktop layout with action bar, input form, and live preview
- **Real-time Updates**: Direct state updates trigger immediate re-rendering of preview (<50ms target)
- **Micro-animations**: Comprehensive animation framework with smooth transitions, hover effects, and delightful user interactions

### Web Application Framework
- **Platform**: Modern web browsers with responsive design
- **Architecture**: Client-side React app with browser-based storage and APIs
- **Security**: CSP-compliant with secure client-side operations
- **Development**: Webpack-based build system with hot reload support
- **Deployment**: Multi-platform deployment support:
  - Netlify-optimized static site deployment with client-side routing support
  - Replit Cloud Run deployment with Express.js production server
  - Docker containerization support for cloud deployment
  - Static file serving via serve package or Express.js server

### Data Storage & Persistence
- **Storage Method**: Browser localStorage and IndexedDB for client-side persistence
- **Data Structure**: JSON-based storage for invoices, templates, business profiles, and settings
- **Export/Import**: JSON file download/upload for data portability and backup
- **Cloud Integration**: Optional integration with cloud storage services for synchronization

### Template System
- **Engine**: Mustache.js for logic-less templating with safe HTML rendering
- **Architecture**: Template objects contain HTML strings, styling rules, and default configurations
- **Customization**: Brand colors, fonts, layout options, and business logic rules
- **Built-in Templates**: Clean Professional, Modern Stripe, and Compact Ledger templates

### PDF Generation
- **Method**: Browser print API with optimized print styles for PDF generation
- **Rendering**: Templates rendered as HTML with embedded styles for consistent output
- **Fonts**: Google Fonts (Inter, Roboto Slab) loaded via CDN with local fallbacks
- **Print Optimization**: CSS print media queries and page break controls
- **Alternative**: Client-side PDF generation libraries (jsPDF, Puppeteer) for advanced features

### Calculation Engine
- **Real-time Processing**: Automatic recalculation on any input change
- **Precision**: Banker's rounding for currency accuracy
- **Tax Logic**: Stacking tax rules with configurable categories
- **Discount System**: Both percentage and fixed amount discounts at item and invoice level
- **Fee Management**: Configurable fees with percentage or fixed amounts

## External Dependencies

### Core Framework Dependencies
- **Electron**: Desktop application framework for cross-platform deployment
- **React & React DOM**: Frontend UI framework with TypeScript support
- **Zustand**: Lightweight state management solution

### Build Tools & Development
- **Webpack**: Module bundler with TypeScript and CSS processing
- **TypeScript**: Static typing for improved code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Concurrently**: Development tool for running multiple processes

### Template & Document Processing
- **Mustache.js**: Logic-less templating engine for invoice generation
- **Date-fns**: Date manipulation and formatting utilities
- **UUID**: Unique identifier generation for invoices and components

### Utility Libraries
- **CSS Loader & Style Loader**: Webpack loaders for CSS processing
- **Autoprefixer**: CSS vendor prefix automation
- **Wait-on**: Development utility for process synchronization

### Font Resources
- **Google Fonts**: Inter and Roboto Slab fonts loaded via CDN
- **Embedded Fonts**: Fallback system fonts for offline operation

## Deployment Architecture

### Netlify Configuration
- **Build Command**: `npx webpack --mode production`
- **Publish Directory**: `build/`
- **Redirects**: Configured for SPA client-side routing via _redirects and netlify.toml
- **Static Assets**: Optimized with content hashing and proper cache headers
- **HTML Template**: Located in main folder (index.html) not subfolder for Netlify compatibility

### Production Build Features
- **Code Splitting**: Separate vendor and main bundles for optimal caching
- **Asset Optimization**: Minified CSS/JS with source maps for debugging
- **Client-side Routing**: Full SPA functionality with proper URL handling
- **Performance**: Lighthouse-optimized bundle sizes and loading strategies

## Recent Changes

### Deployment Configuration (August 2025)
- **Issue Resolved**: Fixed Cloud Run deployment errors due to missing deployment section in .replit file
- **Files Added**: 
  - `start.sh` and `start_serve.sh` - Production startup scripts
  - `server.js` - Express.js production server for static file serving
  - `replit_deploy.toml` and `deploy.json` - Deployment configuration files
  - `Dockerfile` - Container configuration for Cloud Run deployment
  - `DEPLOY.md` - Comprehensive deployment documentation
- **Dependencies Added**: `serve` package and `express` for production serving
- **Configuration**: Proper port binding (5000) with 0.0.0.0 host for external access
- **Testing**: Verified server syntax and build output integrity

Note: The application is designed to be completely offline-first with no external API dependencies during runtime. All external resources are either bundled or have local fallbacks, making it perfect for static hosting platforms like Netlify and cloud deployment platforms like Replit Cloud Run.