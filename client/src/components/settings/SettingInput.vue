<template>
  <div v-if="option.type === 'boolean'">
    <input type="checkbox" :name="name" :checked="!!option.value" />
  </div>
  <div v-if="option.type === 'number'">
    <input type="number" :name="name" :value="option.value" />
  </div>
  <div v-if="option.type === 'enum'">
    <select :name="name" :value="option.value">
      <option v-for="choice in option.options" :value="(option).default">{{choice}}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type {Setting} from "@/components/settings/settings.types";

defineProps<{
  name: string,
  option: Setting['option']
}>()
</script>

<style scoped>

</style>
