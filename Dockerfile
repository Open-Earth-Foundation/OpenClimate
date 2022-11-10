# syntax=docker/dockerfile:1

# build environment

FROM public.ecr.aws/docker/library/node:16 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . ./
RUN npm ci --legacy-peer-deps
RUN npm run build

# production environment

FROM public.ecr.aws/nginx/nginx:stable-alpine as web
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
