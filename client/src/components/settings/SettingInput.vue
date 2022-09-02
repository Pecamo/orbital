<template>
  <div v-if="inputType === 'number'">
    <input type="number" :name="name" :value="defaultValue" />
  </div>
  <div v-if="inputType === 'checkbox'">
    <input type="checkbox" :name="name" :value="defaultValue" />
  </div>
  <div v-if="inputType === 'select'">
    <select :name="name" :value="defaultValue">
      <option v-for="option in options" :value="option.value">{{option.label}}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type {SelectSetting, Setting} from "@/components/settings/settings.types";

defineProps<{
  name: Setting
  inputType: Setting['inputType'],
  defaultValue: Setting['defaultValue'],
  options?: SelectSetting['options'],
}>()
</script>

<style scoped>

</style>
