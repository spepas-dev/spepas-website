FROM node:21-alpine3.18 AS builder

WORKDIR /app
COPY package.json ./
COPY tsconfig*.json ./
# Pin pnpm to v10 — pnpm 11+ requires Node >=22.13 and the base image is
# still on Node 21. Bump both together when we move to Node 22 LTS.
RUN npm install -g pnpm@10
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Bundle app source
RUN pnpm run build

FROM nginx:stable-alpine

WORKDIR /app
COPY --from=builder /app/build /app/html
COPY nginx.conf /app
RUN mkdir -p /app/run && apk add --no-cache bash && apk add --no-cache curl

EXPOSE 80

CMD ["nginx", "-c", "/app/nginx.conf"]
