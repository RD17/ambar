FROM redis:4.0.2-alpine

RUN apk add --update curl && \
    rm -rf /var/cache/apk/*

COPY redis.conf /usr/local/etc/redis/redis.conf

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]

HEALTHCHECK --interval=5s --timeout=30s --retries=50 \
  CMD curl -f localhost:6379 || exit 1