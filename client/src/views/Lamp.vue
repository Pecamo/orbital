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
import { Color } from "../../../server/color";

export default defineComponent({
  data() {
    return {
      // TODO fetch current color
      hexColors: ["#000000", "#000000"] as string[],
      selectedAnimation: "",
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
      this.sendColors(this.colors);
    },

    onNewAnimation() {
      this.sendAnimnation(this.selectedAnimation);
    },

    onNewTopLed() {
      this.sendTopLedNb(this.topLedNb);
    },

    // Send colors to the server
    sendColors(colors: Color[]) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/lamp/colors", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(colors));
    },

    // Send animation mode to the server
    sendAnimnation(animationName: string) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/lamp/animation", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ animation: animationName }));
    },

    // Send top led number to the server
    sendTopLedNb(topLedNb: number) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/lamp/set-top-led", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ topLedNb }));
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
