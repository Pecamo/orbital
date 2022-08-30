<template>
  <div class="page-grid">
    <div class="line">
      <h1>Lamp</h1>
    </div>
    <div class="line">
      <label>Animation Mode</label>
      <select
        v-model="currentConfig.selectedAnimation"
        @change="onNewAnimation"
        name="animation"
        id="animation-picker"
      >
        <option
          v-for="option in currentConfig.animationOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <div class="line">
      <label>Color 1</label>
      <div>
        <input
          v-model="currentConfig.hexColors[0]"
          @change="onNewColor"
          type="color"
          class="color-picker"
        />
      </div>
    </div>
    <div class="line">
      <label>Color 2</label>
      <div>
        <input
          v-model="currentConfig.hexColors[1]"
          @change="onNewColor"
          type="color"
          class="color-picker"
        />
      </div>
    </div>
    <div class="line">
      <label>Top Led Number</label>
      <div>
        <input
          v-model="currentConfig.topLedNb"
          @change="onNewTopLed"
          type="number"
          class="top-led-number"
          min="0"
          step="1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { axiosInstance } from "../axios-common";
import { Color } from "../../../server/color";
import { reactive } from "@vue/reactivity";

const currentConfig = reactive({
  // TODO fetch current color
  hexColors: ["#000000", "#000000"] as string[],
  selectedAnimation: "None",
  // TODO Query from server
  animationOptions: [
    "Off",
    "None",
    "Strobe",
    "Strobe2",
    "Alternating",
    "Rainbow",
    "Fire",
    "Fire rotating",
    "Blue Fire rotating",
    "Stars",
    "Matrix",
    "Rainbow Sliding Window",
    "Sliding Window",
    "Old School Segments",
    "Game of Life",
    "Flashing Aperture",
    "Flashing Segments",
    "Particle Wave",
  ],
  topLedNb: 0,
});

const colors = reactive({
  get(): Color[] {
    return currentConfig.hexColors.map((hex: string) => Color.fromHex(hex));
  },
  set(colors: Color[]) {
    currentConfig.hexColors = colors.map((c) => Color.toHex(c));
  },
});

// Color Picker
function onNewColor() {
  axiosInstance.post("/lamp/colors", colors);
}

function onNewAnimation() {
  axiosInstance.post("/lamp/animation", {
    animation: currentConfig.selectedAnimation,
  });
}

function onNewTopLed() {
  axiosInstance.post("/lamp/set-top-led", { topLedNb: currentConfig.topLedNb });
}
</script>

<style scoped>
input {
  height: 100%;
  width: 100%;
  text-align: right;
}

.page-grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}

.page-grid .line {
  display: flex;
  height: 0;
  flex-grow: 1;
  width: 100%;
}

.page-grid .line > * {
  width: 0;
  flex-grow: 1;
  margin: calc(2 * var(--unit));
}

.page-grid .line > :not(:first-child) {
  margin-left: 1vw;
}

.page-grid .line label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
}
</style>
