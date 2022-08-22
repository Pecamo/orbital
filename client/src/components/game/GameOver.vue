<template>
  <div class="scene" id="{{ isWon ? 'CONGRATULATIONS' : 'SO SAD' }}">
    <div class="background"></div>
    <p style="color: var(--base-color-bg)">
      {{ isWon ? "CONGRATULATIONS" : "SO SAD" }}
    </p>
    <p>{{ isWon ? "You won!" : "You lost!" }}</p>
    <button class="button retry" @click="playAgainClicked">Play again</button>
  </div>
</template>

<script setup lang="ts">
import { WebSocketHandler } from "../../ws";

defineProps(["isWon"]);

function playAgainClicked() {
  WebSocketHandler.onJoin();
}
</script>

<style scoped>
#wait,
#getReady,
#won,
#lost,
#gameInProgress,
#spectate {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
