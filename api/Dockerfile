FROM public.ecr.aws/docker/library/node:16-alpine

COPY . /app/

WORKDIR /app
RUN npm ci --legacy-peer-deps --omit dev

RUN chmod +x ./startup.sh
EXPOSE 3100
CMD ["/bin/sh", "/app/startup.sh"]
