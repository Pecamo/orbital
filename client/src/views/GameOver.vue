<template>
  <div class="scene" id="won">
    <div class="background"></div>
    <p style="color: var(--base-color-bg)">CONGRATULATIONS</p>
    <p>You won !</p>
    <button class="button retry" onclick="activateSceneWelcome()">
      Play again
    </button>
  </div>
</template>

<script lang="ts"></script>
<style scoped>
#wait,
#getReady,
#won,
#lost,
#gameInProgress,
#spectate {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
