FROM node:19-alpine

COPY . /app

WORKDIR /app

RUN npm install
RUN npx tsc

CMD ["node", "out/index.js"]