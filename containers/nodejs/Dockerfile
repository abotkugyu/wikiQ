FROM node:latest
ENV NODE_PATH /usr/local/lib/node_modules
RUN set -ex; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
    mysql-client
RUN npm install socket.io && npm install log4js && npm install request && npm install querystring && npm install mysql && npm install express && npm install multer
