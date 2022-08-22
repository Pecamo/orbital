export const WebSocketHandler = {
  ws: null as WebSocket | null,
  subscribe: (command: string, callback: (data: any) => void) => {
    if (!WebSocketHandler.subscriptions[command]) {
      WebSocketHandler.subscriptions[command] = [];
    }
    WebSocketHandler.subscriptions[command].push(callback);
  },
  unsubscribe: (command: string, callback: (data: any) => void) => {
    WebSocketHandler.subscriptions[command].splice(
      WebSocketHandler.subscriptions[command].indexOf(callback),
      1
    );
  },
  subscriptions: {} as { [key: string]: ((data: any) => void)[] },
  connect: () => {
    return new Promise<void>((resolve, reject) => {
      if (WebSocketHandler.ws) {
        return;
      }

      console.log("Starting connection to WebSocket Server");
      const wsUrl = new URL(import.meta.env.VITE_ORBITAL_SERVER_BASE_URL);

      // const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
      // export const ws = new WebSocket(wsProtocol + location.host + "/");
      const wsProtocol = wsUrl.protocol === "https:" ? "wss://" : "ws://";
      WebSocketHandler.ws = new WebSocket(wsProtocol + wsUrl.host + "/");

      WebSocketHandler.ws.onopen = (evt) => resolve();
      WebSocketHandler.ws.onerror = (evt) => console.error("WS ERROR", evt);
      WebSocketHandler.ws.onclose = (evt) => console.warn("WS CLOSE");

      WebSocketHandler.ws.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        console.log(msg);

        if (!WebSocketHandler.subscriptions[msg.cmd]) {
          return;
        }

        WebSocketHandler.subscriptions[msg.cmd].forEach((sub) => sub(msg));
      };
    });
  },
  disconnect: () => {
    const ws = WebSocketHandler.ws;
    if (ws && ws.readyState === ws.OPEN) {
      WebSocketHandler.ws?.close();
    }

    WebSocketHandler.ws = null;
  },
  sendJSON: (message: any) => {
    const ws = WebSocketHandler.ws;
    if (ws && ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
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
