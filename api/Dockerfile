FROM node:18-alpine

COPY . /app/

WORKDIR /app
RUN npm ci --legacy-peer-deps --omit dev

RUN chmod +x ./startup.sh
EXPOSE 80
CMD ["/bin/sh", "/app/startup.sh"]
