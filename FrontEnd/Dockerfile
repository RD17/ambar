FROM node:10-alpine as node

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g

WORKDIR /FrontEnd
COPY package.json .
RUN npm install --quiet
COPY . .
RUN npm run compile

FROM nginx:latest

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl

# Set a timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=node /FrontEnd/default /etc/nginx/conf.d/default.conf
COPY --from=node /FrontEnd/dist /usr/share/nginx/html

CMD echo $api > /usr/share/nginx/html/apiUrl.txt && nginx -g "daemon off;"

HEALTHCHECK --interval=5s --timeout=30s --retries=50 \
  CMD curl -f localhost:80 || exit 1
