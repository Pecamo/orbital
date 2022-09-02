<template>
  <div id="game-in-progress">
    <div class="background"></div>
    <p>A game is already in progress</p>
    <button class="button" id="backButton" @click="backClicked">Back</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function backClicked() {
  router.replace({ path: "/" });
}
</script>

<style scoped>
#game-in-progress {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#game-in-progress .button {
  font-size: 3vw;
  padding: 1vw;
  margin-top: 6vh;
  margin-bottom: 6vh;
}
</style>
