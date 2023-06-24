FROM node:19.4.0-alpine

WORKDIR /app/backend

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ] ; \
        then npm i ; \
        else npm i --omit=dev; \
        fi

COPY . .

CMD ["npm","run","dev"]
