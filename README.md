![Orbital](./static/logo/logo-github.png)

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

Copy .env configuration:

```sh
cp .env.dist .env
```

[Install and run the display server on your Raspberry Pi with some SK6812/ws2812b RGBW LED strips](https://github.com/BinaryBrain/Rpi-SK6812-ws2812b-RGBW-http-server)

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
