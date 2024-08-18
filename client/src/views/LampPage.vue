<template>
  <div class="lamp-page">
    <h1>Lamp</h1>
    <div class="settings">
      <label>Animation Mode</label>
      <select
        class="input"
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
      <template v-for="(option, i) in options.array" :key="i">
        <label>{{ option.name }}</label>
        <smart-color-picker
          v-if="option.type === 'color'"
          :smartColor="(characteristics.array[i].value as SmartColor)"
          @smartColorUpdate="smartColor => onSmartColorUpdate(smartColor, i)"
        ></smart-color-picker>
        <input
          class="input"
          v-if="option.type === 'number'"
          v-model="characteristics.array[i].value"
          type="number"
          :min="option.min"
          :max="option.max"
          :step="option.step"
        />
        <select
          class="input"
          v-if="option.type === 'select'"
          v-model="characteristics.array[i].value"
        >
          <option
            v-for="opt in option.options"
            :key="opt.label"
            :value="opt.optionValue"
          >
            {{ opt.label }}
          </option>
        </select>
      </template>
      <label>Brightness</label>
      <vue-slider
        v-model="brightness"
        class="input brightness-slider"
        @change="onBrightnessChange"
        :min="0"
        :max="100"
        :lazy="true"
        :marks="[0, 50, 100]"
      />
      <DynamicButton color="yellow" variant="normal" @click="refreshABC">
        Refresh
      </DynamicButton>
      <DynamicButton color="green" variant="normal" @click="applyAnimation">
        Apply
      </DynamicButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import DynamicButton from "../components/shared/DynamicButton.vue";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import SmartColorPicker from "../components/shared/SmartColorPicker.vue";
import { axiosInstance } from "../axios-common";
import type { OptionWithCurrentCharacteristic, Characteristic } from "../../../server/types/LampAnimation";
import type { SmartColor } from "../../../server/types/SmartColor";
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "vue";

const currentConfig = reactive({
  selectedAnimation: "None",
  animationOptions: [],
});

const characteristics: { array: Characteristic[] } = reactive({ array: [] });
const options: { array: OptionWithCurrentCharacteristic[] } = reactive({ array: [] });
const brightness = ref(100);

onMounted(() => {
  axiosInstance.get("/lamp/animationNames")
    .then(res => JSON.parse(res.data))
    .then(data => {
      currentConfig.animationOptions = data.animationNames;
    });

  refreshABC();
});

// Animations, Brightness, Characteristics
function refreshABC() {
  axiosInstance.get("/lamp/brightness")
    .then(res => JSON.parse(res.data))
    .then(data => brightness.value = data.brightness);

  axiosInstance.get(`/lamp/animation`)
    .then(res => {
      return JSON.parse(res.data);
    })
    .then(data => {
      currentConfig.selectedAnimation = data.animation.name;
      onNewAnimation();
    })
}

function onSmartColorUpdate(smartColor: SmartColor, i: number) {
  characteristics.array[i].value = smartColor;
}

function onNewAnimation() {
  axiosInstance
    .get(`/lamp/options/${currentConfig.selectedAnimation}`)
    .then(res => {
      return JSON.parse(res.data);
    })
    .then(data => {
      options.array = data.options;
      characteristics.array.splice(0, characteristics.array.length);
      for (let i = 0; i < options.array.length; i++) {
        const o = options.array[i];
        switch (o.type) {
          case "number":
            characteristics.array.push({ type: o.type, value: o.currentCharacteristicValue });
            break;
          case "select":
            characteristics.array.push({ type: o.type, value: o.currentCharacteristicValue });
            break;
          case "color":
            console.log(i, { type: o.type, value: o.currentCharacteristicValue });
            characteristics.array.push({ type: o.type, value: o.currentCharacteristicValue });
            break;
        }
      }
    });
}

function applyAnimation() {
  axiosInstance.post("/lamp/animation", {
    animation: currentConfig.selectedAnimation,
  });

  axiosInstance.post("/lamp/characteristics", characteristics.array);
}

function onBrightnessChange(brightness: number) {
  axiosInstance.post("/lamp/brightness", { brightness });
}
</script>

<style scoped>
h1 {
  margin-top: 1em;
  margin-bottom: 1em;
  font-size: calc(7 * var(--unit));
}

.lamp-page {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: var(--base-color-fg);
  overflow: auto;
  max-height: 100%;
}

.settings {
  display: grid;
  grid-template-columns: repeat(2, auto);
  justify-content: center;
  align-items: center;
  row-gap: 1em;
  column-gap: 1em;
  margin: 0 1em;
  font-size: 20px;
}

.input {
  text-align: right;
  width: 100%;
  height: 100%;
}

input[type="text"],
input[type="number"] {
  font-size: calc(5 * var(--unit));
  text-align: right;
  max-width: max-content;
}

label {
  font-size: calc(5 * var(--unit));
}
</style>
