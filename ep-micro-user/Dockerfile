FROM ghcr.io/techknowkraftai/node AS build

WORKDIR /usr/src/app

COPY package.json ./

# Add this only if installing package from an internal git repository
ENV GIT_SSL_NO_VERIFY=1

RUN npm install

COPY . .

EXPOSE 9003

CMD [ "npm", "start" ]
