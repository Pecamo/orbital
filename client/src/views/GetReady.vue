<template>
  <div class="scene" id="getReady">
    <div class="background"></div>
    <p>Waiting for eventual other players...</p>
    <p>Starting in <span id="startsIn">20</span> sec</p>
    <p
      style="padding: 2vw; background-color: var(--base-color-bg); color: black"
    >
      Remember your color !
    </p>
  </div>
</template>

<script setup lang="ts">
</script>
<style scoped>
#getReady {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
