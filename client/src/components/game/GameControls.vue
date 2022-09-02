<template>
  <div id="play">
    <div class="background"></div>
    <button
      class="left button"
      id="leftButton"
      :style="{ 'background-color': color }"
      @mousedown="onLeftPress"
      @mouseup="onLeftRelease"
      @touchstart="onLeftPress"
      @touchend="onLeftRelease"
    >
      <img class="img" src="@/assets/left-arrow.svg" />
    </button>
    <button
      class="fire button"
      id="fireButton"
      :style="{ 'background-color': color }"
      @mousedown="onFirePress"
      @mouseup="onFireRelease"
      @touchstart="onFirePress"
      @touchend="onFireRelease"
    >
      <img class="img" src="@/assets/target.svg" />
    </button>
    <button
      class="right button"
      id="rightButton"
      :style="{ 'background-color': color }"
      @mousedown="onRightPress"
      @mouseup="onRightRelease"
      @touchstart="onRightPress"
      @touchend="onRightRelease"
    >
      <img class="img" src="@/assets/right-arrow.svg" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "@vue/runtime-core";
import { WebSocketHandler } from "../../ws";
import { AudioHandler } from "../../audio";
defineProps<{
  color: string;
}>();

const bindings = {
  ArrowLeft: [onLeftPress, onLeftRelease],
  a: [onLeftPress, onLeftRelease],

  ArrowRight: [onRightPress, onRightRelease],
  d: [onRightPress, onRightRelease],

  " ": [onFirePress, onFireRelease],
  Control: [onFirePress, onFireRelease],
  Shift: [onFirePress, onFireRelease],
  Alt: [onFirePress, onFireRelease],
  y: [onFirePress, onFireRelease],
};

function onKeyDown(event: { key: string }) {
  if (event.key in bindings) {
    bindings[event.key as keyof typeof bindings][0]();
  }
}

function onKeyUp(event: { key: string }) {
  if (event.key in bindings) {
    bindings[event.key as keyof typeof bindings][1]();
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
});

// Warning! This is global so to ensure that this component gets unmounted, it should be in a v-if, not v-show.
onUnmounted(() => {
  document.removeEventListener("keydown", onKeyDown);
  document.removeEventListener("keyup", onKeyUp);
});

function onLeftPress() {
  WebSocketHandler.onLeftPress();
}

function onLeftRelease() {
  WebSocketHandler.onLeftRelease();
}

function onRightPress() {
  WebSocketHandler.onRightPress();
}

function onRightRelease() {
  WebSocketHandler.onRightRelease();
}

function onFirePress() {
  WebSocketHandler.onFirePress();
}

function onFireRelease() {
  WebSocketHandler.onFireRelease();
  AudioHandler.play("fire");
}
</script>

<style scoped>
#play .button {
  background-color: var(--base-color-bg);
  color: var(--base-color-fg);
  justify-content: center;
  align-items: center;
  font-size: 20vw;
  flex-grow: 1;
  height: 100%;
  border: 0;
  max-width: 32%;
  max-height: 98%;
  fill: white;
}

#play .button:active {
  filter: contrast(0.5);
}

.fire {
  font-size: 25vw;
}
</style>
