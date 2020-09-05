Orbital
=======

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

[Install and run the display server on your Raspberry Pi with some SK6812/ws2812b RGBW LED strips](https://github.com/BinaryBrain/Rpi-SK6812-ws2812b-RGBW-http-server)

Run
---

```sh
npm start
```

### Run without a LED strip display:

```sh
npm start -- --no-display
```

### Invert the LED strip display:

```sh
npm start -- --invert
```

Develop
-------

You can compile in watch mode with:

```sh
npm run watch
```
