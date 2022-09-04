<template>
  <div id="spectate">
    <canvas ref="spectateCanvas" width="600" height="600"></canvas>
    <div class="end-message" v-show="color">
      Player
      <span class="color-square" :style="{ 'background-color': color }"></span>
      won the game!
    </div>
  </div>
</template>

<script setup lang="ts">
import { WebSocketHandler } from "@/ws";
import { onMounted, ref } from "vue";

const spectateCanvas = ref(null);
const color = ref<string>(null);

onMounted(async () => {
  await WebSocketHandler.connect();
  WebSocketHandler.subscribe("spectateData", onSpectateData);
  WebSocketHandler.subscribe("spectateEnd", onSpectateEnd);
  WebSocketHandler.onSpectate();
});

function onSpectateEnd(data) {
  const c = data.data.winner.color;
  color.value = `rgb(${c.r}, ${c.g}, ${c.b})`;
  console.log(color.value);
}

function onSpectateData(data) {
  data = data.data;
  if (!spectateCanvas.value) {
    return;
  }

  const result = Array(data.stageSize).fill(null);

  if (data.battleRoyale) {
    const warnColor = { r: 100, g: 0, b: 0, w: 0 };
    data.battleRoyale.warnLines.forEach((line) => {
      if (line._isLooping) {
        for (let i = line._from; i <= data.stageSize; i++) {
          result[i] = warnColor;
        }
        for (let i = 0; i <= line._to; i++) {
          result[i] = warnColor;
        }
      } else {
        for (let i = line._from; i <= line._to; i++) {
          result[i] = warnColor;
        }
      }
    });

    const deathColor = { r: 255, g: 0, b: 0, w: 0 };
    data.battleRoyale.deathLines.forEach((line) => {
      if (line._isLooping) {
        for (let i = line._from; i <= data.stageSize; i++) {
          result[i] = deathColor;
        }
        for (let i = 0; i <= line._to; i++) {
          result[i] = deathColor;
        }
      } else {
        for (let i = line._from; i <= line._to; i++) {
          result[i] = deathColor;
        }
      }
    });
  }

  data.characters
    .filter((c) => c.alive)
    .forEach((p) => {
      result[p.x] = p.color;
    });
  data.shots.forEach((s) => {
    const pColor = data.characters[s.owner].color;
    result[s.x] = {
      r: pColor.r / 1.5,
      g: pColor.g / 1.5,
      b: pColor.b / 1.5,
    };
  });

  const radius =
    Math.min(spectateCanvas.value.height, spectateCanvas.value.width) / 2;
  const ctx = spectateCanvas.value.getContext("2d");
  ctx.clearRect(0, 0, spectateCanvas.value.width, spectateCanvas.value.height);
  const one = (Math.PI * 2) / data.stageSize;
  result.forEach((c, i) => {
    ctx.beginPath();
    const from = i * one;
    const to = (i + 1) * one;
    ctx.arc(radius, radius, radius - 25, from, to);
    ctx.arc(radius, radius, radius - 5, to, from, true);
    ctx.closePath();
    ctx.stroke();
    if (c !== null) {
      ctx.fillStyle = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")";
      ctx.fill();
    }
  });
}
</script>

<style scoped>
#spectate {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#spectateResult {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#spectate .background {
  background-color: #444444;
}

.end-message {
  margin-top: 1em;
}

.color-square {
  display: inline-block;
  height: 1ch;
  width: 1ch;
  border: 1px solid white;
}
</style>
