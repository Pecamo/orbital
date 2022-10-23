<template>
  <label :for="setting.name">{{ setting.name }}</label>
  <setting-input
    :name="setting.name"
    :option="setting.option"
    @setValue="setValueCallback"
  />
</template>

<script setup lang="ts">
import type {Setting} from "@/components/settings/settings.types";
import SettingInput from "@/components/settings/SettingInput.vue";

const emits = defineEmits(["setValue"]);

const setValueCallback = (...args: any) => {
  emits("setValue", ...args);
}

defineProps<{
  setting: Setting,
  data: any,
}>()

</script>

<style scoped>
.setting {
  display: flex;
}

label {
  font-size: 2em;
}
</style>
