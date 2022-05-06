FROM node:16-alpine
RUN apk update && apk add curl
WORKDIR /app/task
COPY ./package.json /app/task
RUN npm i
COPY ./ /app/task
EXPOSE 58545
CMD npm start

