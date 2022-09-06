<template>
  <div class="simple-view">
    <p>A game is already in progress</p>
    <DynamicButton color="red" variant="normal" @click="backClicked">
      Back
    </DynamicButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import DynamicButton from "../shared/DynamicButton.vue";

const router = useRouter();

function backClicked() {
  router.replace({ path: "/" });
}
</script>

<style scoped>
</style>
