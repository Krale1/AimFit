FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

RUN npm install -g ts-node

EXPOSE 5000

CMD ["npm", "run", "dev"]
