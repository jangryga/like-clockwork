FROM node:22-alpine AS viewer-build

WORKDIR /app/viewer

COPY viewer/package*.json ./
RUN npm ci

COPY viewer/ ./
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ ./src/

COPY --from=viewer-build /app/viewer/dist ./viewer/dist

COPY data/ ./data/
COPY assets/ ./assets/

ENV PORT=3001
EXPOSE 3001

CMD ["npx", "tsx", "src/server.ts"]
