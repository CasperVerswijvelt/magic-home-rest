FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

ENV PORT = 3000

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "node", "index.js" ]