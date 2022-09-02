<template>
  <div id="changeGameOptions">
    <div class="background"></div>
    <h1>Change Game Settings</h1>
    <form class="settings">
      <SettingLine v-for="setting in settings" :setting="setting" ></SettingLine>
    </form>
    <button class="button" id="backButton" @click="backClicked">Back</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import SettingLine from "@/components/settings/SettingLine.vue";
import type {Setting} from "@/components/settings/settings.types";

const settings: Array<Setting> = [
  {
    label: "Battle Royale",
    name: "BattleRoyale",
    inputType: "checkbox",
    defaultValue: false,
  },
  {
    label: "Missile Collision",
    name: "MissileCollision",
    inputType: "select",
    options: [
      {label: "On", value: "on"},
      {label: "Off", value: "off"},
      {label: "Stronger", value: "stronger"}
    ],
    defaultValue: "on",
  },
  {
    label: "Shot Cooldown",
    name: "ShotCooldown",
    inputType: "number",
    defaultValue: 12,
  }
];

const router = useRouter();

function backClicked() {
  router.replace({ path: "/" });
}
</script>

<style scoped>
#changeGameOptions {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: var(--base-color-fg);
}
</style>
