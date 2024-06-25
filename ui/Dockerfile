# syntax=docker/dockerfile:1

# build environment

FROM node:18 AS build
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY . ./
RUN npm ci --legacy-peer-deps
ENV SKIP_PREFLIGHT_CHECK=true
RUN npm run build

# production environment

FROM nginx:1-alpine AS web
COPY --from=build /app/build /usr/share/nginx/html
RUN mkdir /app/
COPY --from=build /app/startup.sh /app/
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/app/startup.sh", "/usr/share/nginx/html"]
