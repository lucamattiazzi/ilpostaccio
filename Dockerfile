FROM node:alpine

RUN mkdir /src
COPY . /src
RUN echo "{}" > /src/cacheDb.json

CMD ["yarn", "start"]