<template>
  <div class="scene" id="game-over">
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

defineProps<{
  isWon: boolean;
}>();

function playAgainClicked() {
  WebSocketHandler.onJoin();
}
</script>

<style scoped>
#wait,
#getReady,
#game-over,
#gameInProgress,
#spectate {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
