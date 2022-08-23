<template>
  <div class="scene" id="getReady">
    <div class="background"></div>
    <p>Waiting for eventual other players...</p>
    <p>Starting in {{ startsIn }} sec</p>
    <p
      style="padding: 2vw; color: black"
      :style="{ 'background-color': color }"
    >
      Remember your color!
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps(["startsIn", "color"]);
</script>
<style scoped>
#getReady {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
