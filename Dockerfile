FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --production

COPY . .

ENV PORT 3012
EXPOSE 3012

CMD ["node", "server.js"]
