# Conciliatory Nest Base Dockerfile
# ---------------------------------------
# ------- Stage: build ------------------
# ---------------------------------------

FROM node:16.13.2-alpine AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install glob rimraf

RUN npm i -g @nestjs/cli && npm install --only=development

COPY . .
RUN npm run build

# ---------------------------------------
# ---------------------------------------
# ------- Stage: prod -------------------
# ---------------------------------------

FROM node:16.13.2-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT=3000

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

COPY . .
RUN npm i -g @nestjs/cli && npm install pm2 -g && npm install pm2 -g && npm ci --only=production --ignore-scripts
COPY ./id_rsa /usr/src/app/dist
COPY --from=development /usr/src/app/dist ./dist
CMD ["pm2-runtime", "dist/main.js"]

# ---------------------------------------