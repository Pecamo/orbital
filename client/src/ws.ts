export const WebSocketHandler = {
  ws: null as WebSocket | null,
  connect: () => {
    if (WebSocketHandler.ws) {
      return;
    }

    console.log("Starting connection to WebSocket Server");
    const wsUrl = new URL(import.meta.env.VITE_ORBITAL_SERVER_BASE_URL);

    // const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    // export const ws = new WebSocket(wsProtocol + location.host + "/");
    const wsProtocol = wsUrl.protocol === "https:" ? "wss://" : "ws://";
    WebSocketHandler.ws = new WebSocket(wsProtocol + wsUrl.host + "/");

    WebSocketHandler.ws.onopen = (evt) => console.log("WS OPEN");
    WebSocketHandler.ws.onerror = (evt) => console.log("WS ERROR", evt);
    WebSocketHandler.ws.onclose = (evt) => console.log("WS CLOSE");

    WebSocketHandler.ws.onmessage = (evt) => {
      console.log(evt.data);
    };
  },

  sendJSON: (message: any) => {
    const ws = WebSocketHandler.ws;

    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error("Websocket is null or closed");
    }
  },

  onJoin: () => {
    WebSocketHandler.sendJSON({ cmd: "join" });
  },
  onCancel: () => {
    WebSocketHandler.sendJSON({ cmd: "cancel" });
  },
  onSpectate: () => {
    WebSocketHandler.sendJSON({ cmd: "spectate" });
  },
  onLeftPress: () => {
    WebSocketHandler.sendJSON({ cmd: "press", data: "left" });
  },
  onLeftRelease: () => {
    WebSocketHandler.sendJSON({ cmd: "release", data: "left" });
  },
  onRightPress: () => {
    WebSocketHandler.sendJSON({ cmd: "press", data: "right" });
  },
  onRightRelease: () => {
    WebSocketHandler.sendJSON({ cmd: "release", data: "right" });
  },
  onFirePress: () => {
    WebSocketHandler.sendJSON({ cmd: "press", data: "fire" });
  },
  onFireRelease: () => {
    WebSocketHandler.sendJSON({ cmd: "release", data: "fire" });
  },
  onQueryGameOptions: () => {
    WebSocketHandler.sendJSON({ cmd: "queryGameOptions" });
  },
  onWriteGameOptions: () => {
    WebSocketHandler.sendJSON({ cmd: "writeGameOptions" });
  },
};
