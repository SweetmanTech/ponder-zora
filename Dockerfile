FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN rm -rf node_modules
RUN rm -rf yarn.lock
RUN yarn install

COPY . .

EXPOSE 42069

CMD ["yarn" ,"start"]
