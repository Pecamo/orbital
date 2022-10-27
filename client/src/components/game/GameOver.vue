<template>
  <div class="simple-view">
    <p style="color: var(--base-color-bg)">
      {{ isWon ? "CONGRATULATIONS" : "SO SAD" }}
    </p>
    <p>{{ isWon ? "You won!" : "You lost!" }}</p>
    <DynamicButton color="blue" variant="normal" @click="playAgainClicked">
      Play again
    </DynamicButton>
  </div>
</template>

<script setup lang="ts">
import { WebSocketHandler } from "../../ws";
import DynamicButton from "../shared/DynamicButton.vue";

defineProps<{
  isWon: boolean;
}>();

function playAgainClicked() {
  WebSocketHandler.onJoin();
}
</script>

<style scoped>
</style>
