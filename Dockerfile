FROM node:19.4.0-alpine

WORKDIR /app/backend
COPY ./package.json ./

RUN npm i 
        
COPY . .

CMD ["npm","run","test"]
