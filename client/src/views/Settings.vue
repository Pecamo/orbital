<template>
  <div class="scene" id="changeGameOptions">
    <div class="background"></div>
    <h1>Change Game Settings</h1>
    <div id="gameOptionsScene"></div>
  </div>
</template>

<script lang="ts"></script>
<style scoped>
#changeGameOptions {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#changeGameOptions {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: var(--base-color-fg);
}

#changeGameOptions .name {
  margin-top: 3vw;
  margin-bottom: 2vw;
  font-size: 3vw;
}

#changeGameOptions .radio-inputs {
  display: flex;
  justify-content: space-around;
  text-transform: capitalize;
}

#changeGameOptions .button {
  font-size: 3vw;
  padding: 1vw;
  margin: 3vw auto;
}

#changeGameOptions [type="checkbox"],
#changeGameOptions [type="radio"] {
  transform: scale(1.3);
  margin: 0 1vw;
}
</style>
