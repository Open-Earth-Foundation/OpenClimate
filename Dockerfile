# build environment
FROM public.ecr.aws/docker/library/node:14 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
RUN npm install
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
# FROM public.ecr.aws/nginx/nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
