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
  </div>
</template>

<script setup lang="ts">
defineProps<{
  startsIn: number;
  color: string;
}>();
</script>

<style scoped>
</style>
