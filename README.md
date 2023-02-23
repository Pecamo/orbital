![Orbital](./client/src/assets/logo/logo-github.png)

Orbital is a game designed to be played on addressable LED strips, on any one dimensional array of lights.

Control a pixel and shoot others!

Install
-------

Install npm packages:

```sh
npm install
```

Compile typescript:

```sh
npm run build
```

You can use a Raspberry Pi or an ESP to control some SK6812/ws2812b RGBW LED strips.

If you use a Raspberry Pi:
[Install and run the custom display server](https://github.com/BinaryBrain/Rpi-SK6812-ws2812b-RGBW-http-server)

If you use an ESP32 or ESP8266:
[Install and run WLED](https://install.wled.me/)


Copy .env configuration:

```sh
cp .env.dist .env      # For Rpi-SK6812-ws2812b-RGBW-http-server
cp .env.dist.wled .env # For WLED
```

You may want to edit the `.env` file according to your network or preferences

Run
---

```sh
npm start
```

### Invert the LED strip display:

```sh
npm start -- --invert
```

Systemd Services
----------------

Some services example are located in `/services`.  
You can install them in `/etc/systemd/system` on your Raspberry Pi.  
You may need to change them a bit depending on your configuration.

Develop
-------

You can compile in watch mode with:

```sh
npm run watch
```
