FROM node:16 AS ui-build
WORKDIR /usr/src/app
COPY client/ ./client/
RUN cd client && npm install && npm run build

FROM node:16
WORKDIR /usr/src/app/
COPY --from=ui-build /usr/src/app/public ./public
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD ["node", "."]
