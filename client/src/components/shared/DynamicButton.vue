<template>
  <div class="dynamic-button">
    <div class="text"><slot /></div>
    <div class="animated-squares">
      <animated-squares color="var(--rocket-blue)"></animated-squares>
    </div>
  </div>
</template>

<script setup lang="ts">
import AnimatedSquares from "../dynamicAssets/AnimatedSquares.vue";
</script>

<style scoped>
.dynamic-button {
  position: relative;
  background-color: black;
  cursor: pointer;
}

.text {
  position: relative;
  z-index: 5;
  padding: 1em;
  font-size: 2em;
}

.animated-squares {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
