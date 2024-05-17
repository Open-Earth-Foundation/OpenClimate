# syntax=docker/dockerfile:1

# build environment

FROM node:18 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm ci --legacy-peer-deps
RUN npm run build

# production environment

FROM nginx:1-alpine as web
COPY --from=build /app/build /usr/share/nginx/html
RUN mkdir /app/
COPY --from=build /app/startup.sh /app/
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/app/startup.sh", "/usr/share/nginx/html"]
