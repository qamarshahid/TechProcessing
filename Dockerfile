# Multi-stage build for production
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/nest-cli.json ./

# Install all dependencies (including dev) for building
RUN npm ci

# Copy source code
COPY backend/src ./src

# Build the application
RUN npm run build

# Prune to production dependencies only
RUN npm prune --omit=dev && npm cache clean --force

# Production stage
FROM node:20-alpine AS production

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001

# Copy built application and production node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
# Copy healthcheck script
COPY --chown=nestjs:nodejs backend/healthcheck.js ./healthcheck.js

# Switch to non-root user
USER nestjs

# Set environment variables for Cloud Run
ENV NODE_ENV=production
# Note: PORT is automatically set by Cloud Run, do not override it

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["node", "dist/main.js"]