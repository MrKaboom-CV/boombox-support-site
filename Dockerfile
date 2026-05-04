# STAGE 1: Build Environment
# Use a specific, version-locked Node.js image for reproducible builds.
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies cleanly for building
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the TypeScript source to JavaScript
RUN npm run build

# Prune development dependencies to shrink the final image
RUN npm prune --omit=dev

# STAGE 2: Production Environment
# Use a minimal base image for the final container to reduce attack surface.
FROM node:20-slim

WORKDIR /usr/src/app

# Create and switch to a non-root user for enhanced security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 node
USER node

# Copy only the necessary production artifacts from the builder stage
COPY --from=builder --chown=node:nodejs /usr/src/app/dist ./dist
COPY --from=builder --chown=node:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:nodejs /usr/src/app/package.json ./package.json

# Expose the port the service will run on and define the startup command
EXPOSE 3000
CMD [ "node", "dist/index.js" ]