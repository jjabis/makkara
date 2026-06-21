FROM node:20-alpine

# Install build tools for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Data dir created at runtime via volume mount
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "server.js"]
