<template>
  <div class="red-squares" ref="redSquaresElement">
    <div
      v-for="(square, k) in squares"
      :key="k"
      class="square"
      :style="{
        'background-color': square.color,
        'animation-duration': square.time,
        'animation-delay': square.delay,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { ref, onMounted } from "vue";

const nbSquares = ref(0);
const squares: { color: string; time: string; delay: string }[] = reactive([]);

// console.log(getCurrentInstance().parent.vnode.el);
const redSquaresElement = ref<HTMLElement | null>(null);
onMounted(() => {
  if (!redSquaresElement.value) {
    return;
  }

  const width = redSquaresElement.value.offsetWidth;
  const height = redSquaresElement.value.offsetHeight;
  console.log(`${width}x${height}`);
  nbSquares.value = Math.ceil((width * height) / (15 * 15));

  setRandomColors();
});

function setRandomColors() {
  for (let i = 0; i < nbSquares.value; i++) {
    const time = 1 + Math.random();
    const delay = -Math.random() * time * 2;

    squares[i] = {
      color: `rgb(90, 0, 0)`,
      time: `${time}s`,
      delay: `${delay}s`,
    };
  }
}
</script>

<style scoped>
.red-squares {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(15px, 1fr));
  /* grid-gap: 2px; */
  overflow: hidden;
  height: 100%;
  width: 100%;

  /* background-color: black; */
}

@keyframes square-animation {
  0% {
    filter: opacity(1);
  }

  100% {
    filter: opacity(0);
  }
}

.square {
  animation-name: square-animation;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  margin: 1px;
}

.square::before {
  content: "";
  display: block;
  padding-bottom: 100%;
}
</style>
