<template>
  <div class="scene" id="wait">
    <div class="background"></div>
    <p>Waiting for an opponent to connect...</p>
    <button class="button" id="cancelButton" onmouseup="onCancelRelease()">
      Cancel
    </button>
  </div>
</template>

<script lang="ts"></script>
<style scoped>
#wait {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#wait .button {
  font-size: 3vw;
  padding: 1vw;
  margin-top: 6vh;
  margin-bottom: 6vh;
}
</style>
