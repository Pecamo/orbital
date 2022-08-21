<template>
  <div class="scene" id="wait">
    <div class="background"></div>
    <p>Waiting for an opponent to connect...</p>
    <button class="button" id="cancelButton" @click="cancelClicked">
      Cancel
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, onUnmounted } from "vue";
import { WebSocketHandler } from "../ws";

const router = useRouter();

function cancelClicked() {
  WebSocketHandler.onCancel();
  router.replace({ path: "/" });
}

function onGetReady() {
  router.replace({ path: "/getready" });
}

onMounted(() => {
  WebSocketHandler.subscribe("getReady", onGetReady);
  WebSocketHandler.onJoin();
});

onUnmounted(() => {
  WebSocketHandler.unsubscribe("getReady", onGetReady);
});
</script>

<style scoped>
#wait {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#wait .button {
  font-size: 3vw;
  padding: 1vw;
  margin-top: 6vh;
  margin-bottom: 6vh;
}
</style>
