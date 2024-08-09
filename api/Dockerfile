FROM node:alpine

WORKDIR /src/app

COPY . /src/app

EXPOSE 8080

RUN npm install -g nodemon
RUN npm install

CMD ["npm", "start"]

