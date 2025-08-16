# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install Prisma (for database)
RUN npm install -g prisma
COPY prisma ./prisma
RUN npx prisma generate

# Expose port and start the app
EXPOSE 8000
CMD ["npm", "run", "start:prod"]