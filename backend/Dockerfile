# Install all dependencies
FROM node:25-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Install production dependencies only
FROM node:25-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --production

# Compile typescript sources using all dependencies
FROM base AS build
WORKDIR /app
COPY tsconfig.json tsconfig.json
COPY src/ src/
RUN npx tsc

# Combine production only node_modules with compiled javascript files
FROM node:25-alpine AS final
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/package.json ./
CMD ["node", "/app/dist/index.js" ]

EXPOSE $PORT