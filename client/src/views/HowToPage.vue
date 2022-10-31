<template>
  <div id="how">
    <how-to-text></how-to-text>
    <RouterLink class="button retry" to="/">
      <dynamic-button color="red" variant="normal">Back</dynamic-button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import HowToText from "../components/shared/HowToText.vue";
import DynamicButton from "../components/shared/DynamicButton.vue";
</script>
<style scoped>
#how {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 140%;
}
</style>
