FROM node:23.11.0 as build

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY . .
RUN chmod +x ./start.sh
RUN npm run build

FROM node:23.11.0
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist/ ./dist
COPY --from=build /usr/src/app/docker/application/start.sh ./start.sh
COPY --from=build /usr/src/app/node_modules ./node_modules

RUN chmod +x start.sh
CMD ./start.sh production