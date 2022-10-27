import {onMounted, onUnmounted} from "@vue/runtime-core";
import {WebSocketHandler} from "@/ws";

type WebSocketHandlers = {
  [event: string]: (...args: any) => void;
}

export function useWebsocketHandlers(handlers: WebSocketHandlers, onConnected?: () => void, onDisconnected?: () => void) {
  onMounted(async () => {
    await WebSocketHandler.connect();
    Object.entries(handlers).forEach(([eventName, eventHandler]) => {
      WebSocketHandler.subscribe(eventName, eventHandler);
    });
    onConnected?.();
  });

  onUnmounted(() => {
    Object.entries(handlers).forEach(([eventName, eventHandler]) => {
      WebSocketHandler.unsubscribe(eventName, eventHandler);
    });
    WebSocketHandler.disconnect();
    onDisconnected?.();
  });
}
