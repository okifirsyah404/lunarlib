FROM node:lts-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apk add --no-cache bash \
	&& yarn install --frozen-lockfile

COPY . .

RUN yarn remove bcrypt \
	&& yarn add bcrypt --unsafe-perm --allow-root \
	&& yarn add -D @swc/core-linux-musl \
	&& yarn run build


FROM node:lts-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache bash openssl tzdata

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/tsconfig.* ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env ./
COPY --from=builder /usr/src/app/temp ./temp
COPY --from=builder /usr/src/app/raw ./raw

EXPOSE 26783

CMD ["node", "dist/main.js"]
