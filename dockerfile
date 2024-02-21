From node:latest

WORKDIR /home/app

COPY . /home/app/

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]