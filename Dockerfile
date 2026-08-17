# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build


# ---- Production stage ----
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV SETTINGS_FILE=/data/settings.json

COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs

RUN mkdir -p /data

VOLUME ["/data"]

EXPOSE 80

CMD ["node", "server.mjs"]
