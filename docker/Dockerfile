FROM node:16
WORKDIR /usr/src/app
COPY backend/ .
RUN npm i && npm run gen:test:folders
CMD ["npm", "run", "start:test"]