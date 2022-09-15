FROM node:16
WORKDIR /usr/src/app
COPY backend/ .
RUN wget -c https://filesamples.com/samples/video/mp4/sample_960x540.mp4 -O scripts/example.mp4
RUN npm i && npm run gen:test:folders
CMD ["npm", "run", "start:test"]