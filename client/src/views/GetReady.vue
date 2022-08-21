<template>
  <div class="scene" id="getReady">
    <div class="background"></div>
    <p>Waiting for eventual other players...</p>
    <p>Starting in {{ startsIn }} sec</p>
    <p
      style="padding: 2vw; background-color: var(--base-color-bg); color: black"
    >
      Remember your color!
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, onUnmounted, ref } from "vue";
import { WebSocketHandler } from "../ws";

const router = useRouter();
const startsIn = ref(20);

function onGetReady(data: any) {
  startsIn.value = data.data;
  // TODO Handle this in a proper Vue way
  document.documentElement.style.setProperty("--base-color-bg", data.color);
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor?.setAttribute("content", data.color);
}

function onPlay() {
  router.replace({ path: "/play" });
}

onMounted(() => {
  WebSocketHandler.subscribe("play", onPlay);
  WebSocketHandler.subscribe("getReady", onGetReady);
});

onUnmounted(() => {
  WebSocketHandler.unsubscribe("getReady", onGetReady);
  WebSocketHandler.unsubscribe("play", onPlay);
});
</script>
<style scoped>
#getReady {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
