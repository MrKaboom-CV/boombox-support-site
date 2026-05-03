# STAGE 1: Build Environment
# Use a specific, version-locked Node.js image for reproducible builds.
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# Copy only the necessary package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# STAGE 2: Production Environment
# Use a minimal base image for the final container to reduce attack surface.
FROM node:20-slim

WORKDIR /usr/src/app

# Copy dependencies from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the service will run on and define the startup command
EXPOSE 3000
CMD [ "node", "dist/index.js" ]