FROM node:18.17.1 AS base

RUN mkdir -p /home/node/app/node_modules
RUN chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY ./package*.json ./
RUN npm ci
COPY ./nest-cli.json ./
COPY ./tsconfig*.json ./
COPY ./knexfile.js ./


FROM base AS production

COPY ./src ./src
RUN npm run build
ENV NODE_ENV=production
RUN npm prune
COPY ./migrations ./migrations
ENV NO_COLOR=1
CMD ["sh", "-c", "npm run knex -- migrate:latest && npm run start:prod"]
