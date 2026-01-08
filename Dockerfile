FROM node:18-alpine AS base


WORKDIR /app
COPY package*.json ./

RUN npm ci --only=production
COPY server.js ./

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8000

ENV NODE_ENV=production

CMD ["node", "server.js"]