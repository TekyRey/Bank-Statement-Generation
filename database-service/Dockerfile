FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY ./src/transactions.csv /usr/src/app/dist/src/transactions.csv
RUN npm run build
CMD ["node", "dist/index.js"]