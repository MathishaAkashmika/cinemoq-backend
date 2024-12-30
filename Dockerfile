# Build stage
FROM node:20 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./
COPY .env ./
RUN npm install --only=production

# Install dependencies required for bcrypt
RUN apt-get update && apt-get install -y python3 make g++

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

EXPOSE 9000
CMD ["node", "dist/main"]