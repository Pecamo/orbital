# Dockerfile

# Stage 1: Build the VueJS Client
FROM node:22 as client-build

ENV VITE_ORBITAL_SERVER_BASE_URL=http://10.0.0.4:3003

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN cd client && npm install
RUN cd client && npm run build
RUN ls
RUN ls static

# Stage 2: Build the Server
FROM node:22

ENV ORBITAL_PORT=3003
# ENV SSL_ORBITAL_PORT=
# ENV SSL_CERT_PATH=
ENV DISPLAY_API_HOSTNAME=10.0.0.21
ENV DISPLAY_API_INFO_PORT=80
ENV DISPLAY_API_PORT=21324
ENV WAITING_TIME_SEC=10
ENV LAMP_FPS=60
ENV GAME_FPS=20
ENV TOP_LED_NB=0
ENV SPECTATE_MODE_ENABLED=true
ENV LAMP_MODE_ENABLED=true
ENV USE_WLED=true

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
COPY --from=client-build ./static ./static
RUN npm run build

RUN env

EXPOSE 3003
CMD ["npm", "start"]