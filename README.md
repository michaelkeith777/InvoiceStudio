# Invoice Studio Pro

A professional web-based invoice application built with React for generating invoices with real-time preview.

## Features

- **Real-time Invoice Preview**: Live preview updates as you type
- **Professional Templates**: Clean, modern invoice templates
- **Micro-animations**: Delightful user interactions with smooth transitions
- **Comprehensive Calculation Engine**: Automatic tax, discount, and fee calculations
- **Browser-based Storage**: Client-side data persistence
- **PDF Export**: Print-optimized invoice generation
- **Responsive Design**: Works on desktop and mobile devices

## Deployment to Netlify

This application is optimized for Netlify deployment with:

1. **netlify.toml**: Build configuration and redirect rules
2. **_redirects**: Client-side routing support
3. **Production Build**: Optimized webpack bundle
4. **Static Assets**: Properly configured asset paths

### Deploy Steps

1. **Connect Repository**: Link your GitHub/GitLab repository to Netlify
2. **Build Settings**: 
   - Build command: `npx webpack --mode production`
   - Publish directory: `build`
3. **Deploy**: Netlify will automatically build and deploy your application

### Build Command

```bash
npm install
npx webpack --mode production
```

The build output will be in the `build/` directory, ready for static hosting.

## Development

```bash
# Install dependencies
npm install

# Start development server
npx webpack serve --mode development --host 0.0.0.0 --port 5000

# Build for production
npx webpack --mode production
```

## Technical Stack

- **React 19** with TypeScript
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Webpack 5** for bundling
- **Mustache.js** for templating
- **Browser APIs** for PDF generation

## License

Created for StoneActive LLC