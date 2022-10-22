<template>
  <div v-if="option.type === 'boolean'">
    <input
      type="checkbox"
      :name="name"
      :checked="!!option.value"
      @change="onChangeChecked" />
  </div>
  <div v-if="option.type === 'number'">
    <input
      type="number"
      :name="name"
      :value="option.value"
      @change="onChangeValue" />
  </div>
  <div v-if="option.type === 'enum'">
    <select
      :name="name"
      :value="option.value"
      @change="onChangeValue">
      <option v-for="choice in option.options" :value="choice">{{choice}}</option>
    </select>
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

</style>
