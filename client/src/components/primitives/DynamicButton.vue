<template>
  <div class="dynamic-button">
    <div class="text">Hello</div>
    <div class="red-squares"><red-squares></red-squares></div>
  </div>
</template>

<script setup lang="ts">
import RedSquares from "../dynamicAssets/RedSquares.vue";
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

.red-squares {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
