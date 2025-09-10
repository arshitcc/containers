# build_stage

FROM node:22-alpine AS builder

WORKDIR /app

# COPY package.json ./
# COPY package-lock.json ./

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5173

RUN npm run build


# serve stage

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html 

CMD [ "nginx", "-g", "daemon off" ]

