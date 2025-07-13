# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app


RUN apt-get update && apt-get install -y netcat-openbsd

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the app
CMD ["npm", "run", "dev"]

RUN npm install -g ts-node
CMD ["npx", "ts-node", "app.ts"]
