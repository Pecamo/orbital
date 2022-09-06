<template>
  <div class="simple-view">
    <p>Waiting for an opponent to connect...</p>
    <DynamicButton color="red" variant="normal" @click="cancelClicked">
      Cancel
    </DynamicButton>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { WebSocketHandler } from "../../ws";
import DynamicButton from "../shared/DynamicButton.vue";

const router = useRouter();

function cancelClicked() {
  WebSocketHandler.onCancel();
  router.replace({ path: "/" });
}
</script>

<style scoped>
</style>
