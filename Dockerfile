FROM node:16
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && cd client && npm install && npm run build
COPY . .
EXPOSE 3000
CMD [ "node", "." ]