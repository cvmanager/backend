FROM node:19.4.0-alpine

WORKDIR /app/backend

ARG NODE_ENV
RUN npm i ;
# RUN npm i --only=production;

COPY . .

CMD ["npm","run","dev"]
