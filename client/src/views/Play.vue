<template>
  <div class="scene" id="play">
    <div class="background"></div>
    <button class="left button" id="leftButton">
      <img class="img" src="@/assets/left-arrow.svg" />
    </button>
    <button class="fire button" id="fireButton">
      <img class="img" src="@/assets/target.svg" />
    </button>
    <button class="right button" id="rightButton">
      <img class="img" src="@/assets/right-arrow.svg" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({});
</script>
<style scoped>
#play .button {
  background-color: var(--base-color-bg);
  color: var(--base-color-fg);
  justify-content: center;
  align-items: center;
  font-size: 20vw;
  flex-grow: 1;
  height: 100%;
  border: 0;
  max-width: 32%;
  max-height: 98%;
  fill: white;
}

#play .button:active {
  filter: contrast(0.5);
}

.fire {
  font-size: 25vw;
}
</style>
