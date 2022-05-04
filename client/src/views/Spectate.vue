<template>
  <div class="scene" id="spectate">
    <div class="scene" id="spectate">
      <div class="background"></div>
      <canvas id="spectateCanvas" width="600" height="600"></canvas>
      <div id="spectateResult"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {};
</script>
<style scoped>
#spectate {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#spectateResult {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#spectate .background {
  background-color: #444444;
}
</style>
