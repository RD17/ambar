FROM nginx:latest

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl

# Set a timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY default /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

CMD echo $api > /usr/share/nginx/html/apiUrl.txt && nginx -g "daemon off;"

HEALTHCHECK --interval=5s --timeout=30s --retries=50 \
  CMD curl -f localhost:80 || exit 1