# Set the base image to Node
FROM node:10.16.0-alpine
LABEL MAINTAINER NAVIN MISHRA "navinmishra1717@gmail.com"

# Define working directory
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN mkdir src/log \
  && touch src/log/server.log

EXPOSE 3000
CMD ["node", "./src/server.js"]