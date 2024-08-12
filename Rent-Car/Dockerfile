FROM node:18.20.1-alpine
WORKDIR /app
COPY package*.json .

RUN npm i

EXPOSE 3000

COPY . .

RUN npm run build
CMD ["node", "node_modules/.bin/prisma init"]
CMD ["node", "node_modules/.bin/prisma generate"]
CMD ["node", "node_modules/.bin/prisma migrate dev --name init"]

CMD ["node", "dist/main.js"]