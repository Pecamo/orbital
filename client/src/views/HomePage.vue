<template>
  <div class="scene" id="home">
    <div class="background"></div>
    Welcome to
    <div class="orbital"><img src="@/assets/logo/Orbital-white.svg" /></div>
    <RouterLink
      to="/play"
      class="button"
      id="joinButton"
      @click="AudioHandler.play('confirm')"
      >Join a game</RouterLink
    >
    <DynamicButton variant="primary">Primary</DynamicButton>
    <DynamicButton variant="simple">Simple</DynamicButton>
    <RouterLink to="/settings" class="button mini" id="changeOptionsButton"
      >Change game settings</RouterLink
    >
    <RouterLink to="/how-to" class="button mini" id="howButton"
      >How to play</RouterLink
    >
    <RouterLink to="/spectate" class="button mini" id="spectateButton"
      >Spectate mode</RouterLink
    >
    <RouterLink to="/lamp" class="button mini" id="lampButton">
      Lamp mode
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { AudioHandler } from "../audio";
import DynamicButton from "../components/shared/DynamicButton.vue";
</script>

<style scoped>
#home {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: var(--base-color-fg);
}

#home .button {
  font-size: 6vw;
  padding: 2vw;
  margin-top: 4vh;
  margin-bottom: 4vh;
}

#home .button.mini {
  font-size: 2vw;
  margin-top: 1vh;
  padding: 1vw;
  margin-bottom: 2vh;
}

#home .button:disabled {
  filter: brightness(0.4);
}

#home .orbital {
  font-size: 4vw;
  margin-bottom: 2vw;
  margin-top: 4vw;
}

#home .orbital img {
  height: 15vh;
}
</style>
