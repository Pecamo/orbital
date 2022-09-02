<template>
  <button
    class="dynamic-button"
    :class="[variant, { square: square }]"
    @click="onclick"
  >
    <div class="text"><slot /></div>
    <div class="animated-squares">
      <animated-squares :color="getColor()"></animated-squares>
    </div>
  </button>
</template>

<script setup lang="ts">
import { AudioHandler } from "@/audio";
import AnimatedSquares from "../dynamicAssets/AnimatedSquares.vue";

// TODO Ability to disable buttons
// TODO :active :focus :hover (pixel patterns?)

type Variant = "primary" | "normal";
type Color = "red" | "blue" | "yellow" | "random" | string;
const props = defineProps<{
  variant: Variant;
  color: Color;
  square?: boolean;
  disabled?: boolean;
}>();

function onclick() {
  if (props.variant === "primary") {
    AudioHandler.play("confirm");
  } else {
    AudioHandler.play("button");
  }
}

function getColor() {
  switch (props.color) {
    case "red":
      return "var(--rocket-red)";
    case "blue":
      return "var(--rocket-blue)";
    case "yellow":
      return "var(--rocket-yellow)";
    case "random":
      return `var(--rocket-${getRandomColor()})`;
    default:
      return props.color;
  }
}

function getRandomColor() {
  return ["red", "blue", "yellow"][Math.floor(Math.random() * 3)];
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
  vertical-align: center;
}

.animated-squares {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.primary .text {
  font-size: 3em;
}

.square .text {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.square::before {
  content: "";
  display: block;
  float: left;
  padding-bottom: 100%;
}
</style>
