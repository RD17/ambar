FROM rabbitmq:3-management

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl

# Set a timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY rabbitmq.config /etc/rabbitmq/rabbitmq.config

HEALTHCHECK --interval=5s --timeout=30s --retries=50 \
  CMD curl -f localhost:15672 || exit 1


