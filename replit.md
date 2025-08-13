# Invoice Studio Pro

## Overview

Invoice Studio Pro is a local, offline desktop application built with Electron for generating professional invoices with real-time preview. The application provides a complete invoicing solution with template-based customization, tax/fee management, and PDF export capabilities. It features a split-pane interface with form inputs on the left and live invoice preview on the right, updating instantly as users type.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript for type safety and modern component development
- **State Management**: Zustand for global state management, providing a simple and performant alternative to Redux
- **Styling**: Tailwind CSS with custom component classes and utility-first approach
- **UI Layout**: Three-pane desktop layout with action bar, input form, and live preview
- **Real-time Updates**: Direct state updates trigger immediate re-rendering of preview (<50ms target)

### Desktop Application Framework
- **Platform**: Electron for cross-platform desktop deployment (Windows + macOS)
- **Architecture**: Main process handles file operations, renderer process runs React app
- **Security**: Node integration enabled for file system access (suitable for local app)
- **Development**: Webpack-based build system with hot reload support

### Data Storage & Persistence
- **Storage Method**: Local JSON files in user-accessible directories
- **Data Structure**: Separate files for invoices, templates, business profiles, and settings
- **Backup Strategy**: User-controlled file locations for easy backup and portability
- **No Database**: Avoids external dependencies, maintains offline-first approach

### Template System
- **Engine**: Mustache.js for logic-less templating with safe HTML rendering
- **Architecture**: Template objects contain HTML strings, styling rules, and default configurations
- **Customization**: Brand colors, fonts, layout options, and business logic rules
- **Built-in Templates**: Clean Professional, Modern Stripe, and Compact Ledger templates

### PDF Generation
- **Method**: HTML-to-PDF conversion using Electron's built-in Chromium print API
- **Rendering**: Templates rendered as HTML with embedded styles for consistent output
- **Fonts**: Google Fonts (Inter, Roboto Slab) loaded via CDN with local fallbacks
- **Print Optimization**: CSS print media queries and page break controls

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

Note: The application is designed to be completely offline-first with no external API dependencies during runtime. All external resources are either bundled or have local fallbacks.