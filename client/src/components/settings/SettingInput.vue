<template>
  <div class="input">
    <div class="full" v-if="option.type === 'boolean'">
      <input
        class="checkbox"
        type="checkbox"
        :name="name"
        :checked="!!option.value"
        @change="onChangeChecked" />
    </div>
    <div class="full" v-if="option.type === 'number'">
      <input
        class="full text"
        type="number"
        :name="name"
        :value="option.value"
        maxlength="6"
        @change="onChangeValue" />
    </div>
    <div class="full" v-if="option.type === 'enum'">
      <select
        class="full text"
        :name="name"
        :value="option.value"
        @change="onChangeValue">
        <option v-for="choice in option.options" :value="choice">{{choice}}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Setting} from "@/components/settings/settings.types";
import {onMounted} from "@vue/runtime-core";

const props = defineProps<{
  name: string,
  option: Setting['option']
}>();

const emits = defineEmits(["setValue"]);

const onChangeValue = (event: any) => {
  emits("setValue", props.name, event.target.value);
}

const onChangeChecked = (event: any) => {
  emits("setValue", props.name, event.target.checked);
}

onMounted(() => {
  emits("setValue", props.name, props.option.value);
});
</script>

<style scoped>
.input {
  text-align: right;
  padding-left: 2em;
  width: 100%;
  height: 100%;
}

.full {
  width: 100%;
  height: 100%;
  margin: 0;
}

.checkbox {
  height: 100%;
  width: 3em;
}

.text {
  font-size: 2em;
  text-align: right;
  max-width: max-content;
}

.text[type="number"] {
  max-width: 6ch;
  width: 6ch;
}
</style>
