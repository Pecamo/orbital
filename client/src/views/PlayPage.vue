<template>
  <div>
    <WaitForGame v-show="currentState === States.WAIT"></WaitForGame>
    <GameInProgress
      v-if="currentState === States.GAME_IN_PROGRESS"
    ></GameInProgress>
    <GetReady
      v-if="currentState === States.GET_READY"
      :startsIn="startsIn"
      :color="color"
    ></GetReady>
    <GameControls
      v-if="currentState === States.PLAY"
      :color="color"
    ></GameControls>
    <GameOver
      v-if="currentState === States.GAME_OVER"
      :isWon="isWon"
    ></GameOver>
  </div>
</template>

<script setup lang="ts">
import WaitForGame from "@/components/game/WaitForGame.vue";
import GameInProgress from "@/components/game/GameInProgress.vue";
import GetReady from "@/components/game/GetReady.vue";
import GameControls from "@/components/game/GameControls.vue";
import GameOver from "@/components/game/GameOver.vue";

import { onMounted, onUnmounted } from "@vue/runtime-core";
import { WebSocketHandler } from "../ws";
import { AudioHandler } from "../audio";
import { ref } from "@vue/reactivity";

const enum States {
  WAIT = "wait",
  GAME_IN_PROGRESS = "gameInProgress",
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

function onGameInProgress() {
  currentState.value = States.GAME_IN_PROGRESS;
}

function onGetReady(data: any) {
  currentState.value = States.GET_READY;
  startsIn.value = data.data;
  color.value = data.color;
  // TODO Handle this in a proper Vue way
  // document.documentElement.style.setProperty("--base-color-bg", data.color);
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor?.setAttribute("content", data.color);
}

function onPlay(data: any) {
  color.value = data.color;
  currentState.value = States.PLAY;
  AudioHandler.play("start");
}

function onGameOverWon() {
  isWon.value = true;
  currentState.value = States.GAME_OVER;
  AudioHandler.play("victory");
}

function onGameOverLost() {
  isWon.value = false;
  currentState.value = States.GAME_OVER;
  AudioHandler.play("defeat");
}

onMounted(async () => {
  await WebSocketHandler.connect();
  WebSocketHandler.subscribe("wait", onWait);
  WebSocketHandler.subscribe("gameInProgress", onGameInProgress);
  WebSocketHandler.subscribe("getReady", onGetReady);
  WebSocketHandler.subscribe("play", onPlay);
  WebSocketHandler.subscribe("won", onGameOverWon);
  WebSocketHandler.subscribe("lost", onGameOverLost);
  WebSocketHandler.onJoin();
});

onUnmounted(() => {
  WebSocketHandler.unsubscribe("wait", onWait);
  WebSocketHandler.unsubscribe("gameInProgress", onGameInProgress);
  WebSocketHandler.unsubscribe("getReady", onGetReady);
  WebSocketHandler.unsubscribe("play", onPlay);
  WebSocketHandler.unsubscribe("won", onGameOverWon);
  WebSocketHandler.unsubscribe("lost", onGameOverLost);
  WebSocketHandler.disconnect();
});
</script>

<style scoped></style>
