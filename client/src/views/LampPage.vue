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
    <div v-for="option, i in options.array" :key="option.name" class="line">
      <label>{{ option.name }}</label>
      <div>
        <smart-color-picker
          v-if="option.type === 'color'"
          :smartColor="(characteristics.array[i].value as SmartColor)"
          @smartColorUpdate="smartColor => onSmartColorUpdate(smartColor, i)"
        ></smart-color-picker>
        <input
          v-if="option.type === 'number'"
          v-model="characteristics.array[i].value"
          @change="onChange"
          type="number"
          :min="option.min"
          :max="option.max"
          :step="option.step"
        />
        <select
          v-if="option.type === 'select'"
          v-model="characteristics.array[i].value"
          @change="onChange"
        >
          <option
            v-for="opt in option.options"
            :key="opt.label"
            :value="opt.optionValue"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SmartColorPicker from "../components/shared/SmartColorPicker.vue";
import { axiosInstance } from "../axios-common";
import type { OptionWithCurrentCharacteristic, Characteristic, SmartColor } from "../../../server/types/LampAnimation";
import { reactive } from "@vue/reactivity";
import { onMounted } from "vue";

const currentConfig = reactive({
  selectedAnimation: "None",
  animationOptions: [],
});

const characteristics: { array: Characteristic[] } = reactive({ array: [] });
const options: { array: OptionWithCurrentCharacteristic[] } = reactive({ array: [] });

onMounted(() => {
  axiosInstance.get('/lamp/animationNames')
  .then(res => JSON.parse(res.data))
  .then(data => {
    currentConfig.animationOptions = data.animationNames;
  })
});

function onSmartColorUpdate(smartColor: SmartColor, i: number) {
  characteristics.array[i].value = smartColor;
  onChange();
}

function onChange() {
  axiosInstance.post("/lamp/characteristics", characteristics.array);
}

function onNewAnimation() {
  axiosInstance
    .get(`/lamp/options/${currentConfig.selectedAnimation}`)
    .then((res) => {
      return JSON.parse(res.data);
    })
    .then((data) => {
      options.array = data.options;
      characteristics.array = options.array.map(o => {
        let characteristic: Characteristic;
        if (o.type === "number") {
          characteristic = { type: "number", value: o.currentCharacteristicValue };
        } else if (o.type === "select") {
          characteristic = { type: "select", value: o.currentCharacteristicValue };
        } else if (o.type === "color") {
          characteristic = { type: "color", value: o.currentCharacteristicValue };
        } else {
          throw new Error(`Unhandled option type "${o.type}"`);
        }

        return characteristic;
      });
    });

  axiosInstance.post("/lamp/animation", {
    animation: currentConfig.selectedAnimation,
  });
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
