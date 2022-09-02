<template>
  <div class="home">
    <div class="header full-row">
      <div class="orbital">
        <img src="@/assets/logo/Orbital-white.svg" />
      </div>
    </div>

    <RouterLink to="/play" class="full-row">
      <DynamicButton color="blue" variant="primary" class="grid-button">
        Play
      </DynamicButton>
    </RouterLink>

    <RouterLink to="/settings" class="perspective-button">
      <DynamicButton color="random" variant="normal" square class="grid-button">
        Settings
      </DynamicButton>
    </RouterLink>

    <RouterLink to="/how-to" class="perspective-button">
      <DynamicButton color="random" variant="normal" square class="grid-button">
        How To
      </DynamicButton>
    </RouterLink>

    <RouterLink to="/spectate" class="perspective-button">
      <DynamicButton color="random" variant="normal" square class="grid-button">
        Spectate
      </DynamicButton>
    </RouterLink>

    <RouterLink to="/lamp" class="perspective-button">
      <DynamicButton color="red" variant="normal" square class="grid-button">
        Lamp
      </DynamicButton>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import DynamicButton from "../components/shared/DynamicButton.vue";
</script>

<style scoped>
.home {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 200px));
  justify-content: center;
  column-gap: 5%;
  padding: 1.5em;
  padding-top: 0;
  font-size: 20px;
  perspective: 700px;
}

.perspective-button {
  transform-origin: 0%;
  transform: rotateY(20deg);
}

.perspective-button:nth-child(2n) {
  transform-origin: 100%;
  transform: rotateY(-20deg);
}

.header {
  text-align: center;
}

.full-row {
  grid-column-end: span 2;
}

.grid-button {
  width: 100%;
  height: 100%;
}

.home .orbital {
  font-size: 4vw;
  margin-bottom: 2vw;
  margin-top: 4vw;
}

.home .orbital img {
  height: 15vh;
}
</style>
