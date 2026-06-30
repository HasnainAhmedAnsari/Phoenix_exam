FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm prune --omit=dev

# ---------------- Runtime ----------------

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./
COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/logs && chown -R node:node /app

USER node

EXPOSE 5000

CMD ["npm", "start"]