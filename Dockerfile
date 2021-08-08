FROM node:14

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

USER node
EXPOSE 3000
CMD ["node", "app.js"]
