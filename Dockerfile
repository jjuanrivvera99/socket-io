FROM node:alpine

RUN mkdir /my-app

WORKDIR /my-app

CMD tail -f /dev/null