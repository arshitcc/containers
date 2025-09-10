FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm run build

COPY . .

EXPOSE 8000

ENV PORT=8000

CMD [ "npm", "run", "start" ]

