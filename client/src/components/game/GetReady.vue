<template>
  <div class="simple-view">
    <p>Waiting for eventual other players...</p>
    <p>Starting in {{ startsIn }} sec</p>
    <p
      style="padding: 2vw; color: black"
      :style="{ 'background-color': color }"
    >
      Remember your color!
    </p>
    <how-to-text></how-to-text>
  </div>
</template>

<script setup lang="ts">
import HowToText from "../shared/HowToText.vue";

defineProps<{
  startsIn: number;
  color: string;
}>();
</script>

<style scoped>
</style>
