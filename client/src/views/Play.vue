<template>
  <div>
    <wait v-show="currentState === States.WAIT"></wait>
    <get-ready
      v-show="currentState === States.GET_READY"
      :startsIn="startsIn"
      :color="color"
    ></get-ready>
    <controls v-if="currentState === States.PLAY" :color="color"></controls>
    <game-over
      v-show="currentState === States.GAME_OVER"
      :isWon="isWon"
    ></game-over>
  </div>
</template>

<script setup lang="ts">
import Wait from "@/components/game/Wait.vue";
import GetReady from "@/components/game/GetReady.vue";
import Controls from "@/components/game/Controls.vue";
import GameOver from "@/components/game/GameOver.vue";

import { onMounted, onUnmounted } from "@vue/runtime-core";
import { WebSocketHandler } from "../ws";
import { ref } from "@vue/reactivity";

const enum States {
  WAIT = "wait",
  GET_READY = "getReady",
  PLAY = "play",
  GAME_OVER = "gameOver",
}

const currentState = ref(States.WAIT);
const startsIn = ref(20);
const color = ref("rgb(50,50,50)");
const isWon = ref(false);

function onWait() {
  currentState.value = States.WAIT;
}

function onGetReady(data: any) {
  currentState.value = States.GET_READY;
  startsIn.value = data.data;
  color.value = data.color;
  // TODO Handle this in a proper Vue way
  document.documentElement.style.setProperty("--base-color-bg", data.color);
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor?.setAttribute("content", data.color);
}

function onPlay(data: any) {
  color.value = data.color;
  currentState.value = States.PLAY;
}

function onGameOver(isVictory: boolean) {
  isWon.value = isVictory;
  currentState.value = States.GAME_OVER;
}

onMounted(async () => {
  await WebSocketHandler.connect();
  WebSocketHandler.subscribe("wait", onWait);
  WebSocketHandler.subscribe("getReady", onGetReady);
  WebSocketHandler.subscribe("play", onPlay);
  WebSocketHandler.subscribe("won", () => onGameOver(true));
  WebSocketHandler.subscribe("lost", () => onGameOver(false));
  WebSocketHandler.onJoin();
});

onUnmounted(() => {
  WebSocketHandler.disconnect();
});
</script>

<style scoped></style>
