FROM node:14
EXPOSE 26573:26573
RUN npm install -g pm2
WORKDIR /app/nodejs
RUN git clone https://github.com/Marcos515/opcua.git
CMD cd opcua && node index.js