FROM node:18-slim


WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --only=production

COPY . .

ENV PORT=3012
EXPOSE 3012

CMD ["node", "server.js"]
