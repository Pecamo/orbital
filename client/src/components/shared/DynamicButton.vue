<template>
  <button class="dynamic-button" @click="onclick">
    <div class="text"><slot /></div>
    <div class="animated-squares">
      <animated-squares color="var(--rocket-blue)"></animated-squares>
    </div>
  </button>
</template>

<script setup lang="ts">
import { AudioHandler } from "@/audio";
import AnimatedSquares from "../dynamicAssets/AnimatedSquares.vue";

type Variant = "primary" | "simple";
const props = defineProps<{
  variant: Variant;
}>();

function onclick() {
  if (props.variant === "primary") {
    AudioHandler.play("confirm");
  } else {
    AudioHandler.play("button");
  }
}
</script>

<style scoped>
.dynamic-button {
  position: relative;
  background-color: black;
  cursor: pointer;
  border: 2px solid var(--base-color-fg);
  color: var(--base-color-fg);
}

.text {
  position: relative;
  z-index: 5;
  padding: 1em;
  font-size: 2em;
}

.animated-squares {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
