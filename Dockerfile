# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install serve globally
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder /app/build ./build

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["serve", "-s", "build", "-l", "5000", "--host", "0.0.0.0"]