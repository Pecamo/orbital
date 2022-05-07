<template>
  <div class="page-grid">
    <div class="line">
      <h1>Lamp</h1>
    </div>
    <div class="line">
      <label>Animation Mode</label>
      <select
        v-model="selectedAnimation"
        @change="onNewAnimation"
        name="animation"
        id="animation-picker"
      >
        <option v-for="option in animationOptions" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="line">
      <label>Color 1</label>
      <div>
        <input
          v-model="hexColors[0]"
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
          v-model="hexColors[1]"
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
          v-model="topLedNb"
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

<script lang="ts">
import { defineComponent } from "vue";
import { axiosInstance } from "../axios-common";
import { Color } from "../../../server/color";

export default defineComponent({
  data() {
    return {
      // TODO fetch current color
      hexColors: ["#000000", "#000000"] as string[],
      selectedAnimation: "None",
      // TODO Query from server
      animationOptions: [
        "None",
        "Strobe",
        "Alternating",
        "Rainbow",
        "Fire",
        "Fire rotating",
        "Stars",
        "Matrix",
        "Sliding Window",
        "Old School Segments",
        "Game of Life",
      ],
      topLedNb: 0,
    };
  },

  computed: {
    colors: {
      get(): Color[] {
        return this.hexColors.map((hex: string) => Color.fromHex(hex));
      },
      set(colors: Color[]) {
        this.hexColors = colors.map((c) => Color.toHex(c));
      },
    },
  },

  mounted() {
    // TODO
  },

  methods: {
    // Color Picker
    onNewColor() {
      axiosInstance.post("/lamp/colors", this.colors);
    },

    onNewAnimation() {
      axiosInstance.post("/lamp/animation", { animation: this.selectedAnimation });
    },

    onNewTopLed() {
      axiosInstance.post("/lamp/set-top-led", { topLedNb: this.topLedNb });
    },
  },
});
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
