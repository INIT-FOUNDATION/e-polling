FROM ghcr.io/techknowkraftai/node

WORKDIR /usr/src/app

COPY package.json ./

# Add this only if installing package from an internal git repository
ENV GIT_SSL_NO_VERIFY=1

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "npm", "start" ]
