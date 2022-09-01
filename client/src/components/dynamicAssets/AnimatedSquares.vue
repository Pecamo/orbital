<template>
  <div class="animated-squares" ref="animatedSquaresElement">
    <div
      v-for="(square, k) in squares"
      :key="k"
      class="square"
      :style="{
        'background-color': color,
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
const squares: { time: string; delay: string }[] = reactive([]);
const animatedSquaresElement = ref<HTMLElement | null>(null);
defineProps<{
  color: string;
}>();

onMounted(() => {
  if (!animatedSquaresElement.value) {
    return;
  }

  const width = animatedSquaresElement.value.offsetWidth;
  const height = animatedSquaresElement.value.offsetHeight;
  nbSquares.value = Math.ceil((width * height) / (15 * 15));

  setRandomOpacities();
});

function setRandomOpacities() {
  for (let i = 0; i < nbSquares.value; i++) {
    const time = 1 + Math.random();
    const delay = -Math.random() * time * 2;

    squares[i] = {
      time: `${time}s`,
      delay: `${delay}s`,
    };
  }
}
</script>

<style scoped>
.animated-squares {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(15px, 1fr));
  overflow: hidden;
  height: 100%;
  width: 100%;
}

@keyframes square-animation {
  0% {
    filter: opacity(0.5);
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
