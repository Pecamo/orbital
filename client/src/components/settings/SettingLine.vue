<template>
  <div class="setting">
    <label :for="setting.name">{{ setting.label }}</label>
    <setting-input
      :name="setting.name"
      :input-type="setting.inputType"
      :options="setting.options"
      :defaultValue="setting.defaultValue"
    />
  </div>
</template>

<script setup lang="ts">
import type {Setting} from "@/components/settings/settings.types";
import SettingInput from "@/components/settings/SettingInput.vue";

defineProps<{
  setting: Setting,
}>()
</script>

<style scoped>
.setting {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
