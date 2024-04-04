FROM node

WORKDIR /app

COPY . .

RUN rm -rf node_modules && npm install

EXPOSE 3001

CMD ["node", "app"]
