FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

# Set the debug environment variable for keycloak-connect logging
ENV DEBUG=keycloak-connect:*

CMD ["npm", "run", "dev"]
