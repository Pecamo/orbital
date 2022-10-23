<template>
  <button
    class="dynamic-button"
    :class="[variant, { square: square }]"
    @click="onclick"
  >
    <div class="text">
      <div class="">
        <slot />
      </div>
    </div>

    <div class="animated-squares">
      <AnimatedSquares :color="getColor()"></AnimatedSquares>
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
  z-index: 1;
  padding: 1em;
  font-size: 2em;
  font-family: "Montserrat";
  font-weight: bold;
}

.square .text {
  position: absolute;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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

.square::before {
  content: "";
  display: block;
  float: left;
  padding-bottom: 100%;
}
</style>
