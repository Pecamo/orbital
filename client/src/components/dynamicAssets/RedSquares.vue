<template>
  <div id="red-squares">
    <div v-for="(line, key) in lines" :key="key" class="line">
      <div
        v-for="(square, k) in line"
        :key="k"
        class="square"
        :style="{
          'background-color': square.color,
          'animation-duration': square.time,
          'animation-delay': square.delay,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "@vue/reactivity";

const nbLines = 20;
const nbSquaresPerLine = 20;
const lines: { color: string; time: string; delay: string }[][] = reactive([]);

function setRandomColors() {
  for (let i = 0; i < nbLines; i++) {
    lines[i] = [];

    for (let j = 0; j < nbSquaresPerLine; j++) {
      const time = 1 + Math.random();
      const delay = -Math.random() * time * 2;

      lines[i][j] = {
        color: `rgb(90, 0, 0)`,
        time: `${time}s`,
        delay: `${delay}s`,
      };
    }
  }
}

setRandomColors();
</script>

<style scoped>
#red-squares {
  background-color: black;
}

@keyframes square-animation {
  0% {
    filter: opacity(1);
  }

  100% {
    filter: opacity(0);
  }
}

.line {
  margin: 0;
  padding: 0;
  line-height: 0;
}

.square {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin: 1px;

  animation-name: square-animation;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  /* background-color: red; */
}
</style>
