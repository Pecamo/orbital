<template>
  <div class="smart-color">
    <select v-model="selectedType" @change="onFormUpdate" class="select-type">
      <option value="static">Static</option>
      <option value="gradient">Gradient</option>
      <option value="rainbow">Rainbow</option>
      <option value="random">Random</option>
    </select>
    <div class="parameters">
      <input
        v-if="selectedType === 'static'"
        v-model="selectedColor"
        @change="onFormUpdate"
        type="color"
      />
      <input
        v-if="selectedType === 'gradient'"
        v-model="selectedColorFrom"
        @change="onFormUpdate"
        type="color"
      />
      <input
        v-if="selectedType === 'gradient'"
        v-model="selectedColorTo"
        @change="onFormUpdate"
        type="color"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Color } from "../../../../server/color";
import type { SmartColor } from "../../../../server/types/SmartColor";

const props = defineProps<{
  smartColor: SmartColor;
}>();

const emit = defineEmits(["smartColorUpdate"]);

const selectedType = props.smartColor?.type ? ref(props.smartColor.type) : ref("static");
const selectedColor = props.smartColor?.type === "static" ? ref(Color.toHex(props.smartColor.color)) : ref("#000000");
const selectedColorFrom = props.smartColor?.type === "gradient" ? ref(Color.toHex(props.smartColor.parameters.colorFrom)) : ref("#000000");
const selectedColorTo = props.smartColor?.type === "gradient" ? ref(Color.toHex(props.smartColor.parameters.colorTo)) : ref("#000000");

function onFormUpdate() {
  let emitSmartColor: SmartColor;

  if (selectedType.value === "static") {
    emitSmartColor = {
      type: selectedType.value,
      color: Color.fromHex(selectedColor.value),
    };
  } else if (selectedType.value === "gradient") {
    emitSmartColor = {
      type: selectedType.value,
      parameters: {
        colorFrom: Color.fromHex(selectedColorFrom.value),
        colorTo: Color.fromHex(selectedColorTo.value),
      }
    };
  } else if (selectedType.value === "rainbow" || selectedType.value === "random") {
    emitSmartColor = {
      type: selectedType.value,
    };
  } else {
    throw new Error(`Unhandled option type "${selectedType.value}"`);
  }

  emit("smartColorUpdate", emitSmartColor);
}

function onSmartColorChange(newColor: SmartColor) {
  selectedType.value = newColor.type;

  if (newColor.type === "static") {
    selectedColor.value = Color.toHex(newColor.color);
  } else if (newColor.type === "gradient") {
    selectedColorFrom.value = Color.toHex(newColor.parameters.colorFrom);
    selectedColorTo.value = Color.toHex(newColor.parameters.colorTo);
  } else {
    selectedColor.value = "#000000";
    selectedColorFrom.value = "#000000";
    selectedColorTo.value = "#000000";
  }
}

watch(() => props.smartColor, onSmartColorChange);

</script>

<style scoped>
.smart-color {
  display: grid;
  grid-template-columns: repeat(2, auto);
  justify-content: space-between;
}

.parameters {
  display: flex;
  flex-direction: column;
}

input[type="color"] {
  height: 3em;
  width: 3em;
}
</style>
