FROM node:18.16.0-alpine

#copy package json and tsconfig files for installing dependencies
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

#copy relevant app code for building later
COPY dist ./dist
COPY node_modules ./node_modules
COPY src ./src
COPY nest-cli.json ./

#install nestcli globally for using commands
RUN npm install -g @nestjs/cli

#only build - don't start
RUN nest build

#demo app, no worries..
ENV MONGO_PHONE_BOOK_HOST="mongodb+srv://dbUser:H7o5iWOSek1xEoHc@phone-book.irpesip.mongodb.net/phoneBookDB"

EXPOSE 3000

#on docker start the app
CMD ["node", "dist/main.js"]
