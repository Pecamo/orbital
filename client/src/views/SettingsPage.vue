<template>
  <div id="changeGameOptions">
    <div class="background"></div>
    <h1>Change Game Settings</h1>
    <div v-if="settings.isLoading">
      Loading...
    </div>
    <form id="settings" class="settings" v-if="!settings.isLoading" ref="formRef">
      <setting-line
        v-for="setting in settings.data"
        :setting="setting"
        :data="formData"
        @setValue="setValue"
      ></setting-line>
    </form>
    <button class="button" id="backButton" @click="backClicked">Back</button>
    <button class="button" id="saveButton" @click="saveClicked">Save</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import SettingLine from "@/components/settings/SettingLine.vue";
import {useWebsocketHandlers} from "@/utils/useWebsocket";
import {WebSocketHandler} from "@/ws";
import {reactive} from "@vue/reactivity";
import type {GameOptions} from "../../../server/types/GameOptions";
import type {Setting} from "@/components/settings/settings.types";

const router = useRouter();

const settings: {
  isLoading: boolean,
  data: {} | GameOptions,
} = reactive({
  isLoading: true,
  data: {},
});

const formData: {[key: string]: any} = {};

const setValue = (key: string, value: any) => {
  formData[key] = value;
}

function saveClicked() {
  console.log('data', formData);
  const data: {[key:string]: {value: any}} = {};
  Object.entries(formData).forEach(([key, value]) => {
    data[key] = {value}
    console.log('key, value', key, value);
  });
  const message = {
    cmd: "writeGameOptions",
    data,
  };
  WebSocketHandler.sendJSON(message);
}

function backClicked() {
  router.replace({ path: "/" });
}

function onReadGameOptions({data}: {data: GameOptions}) {
  settings.isLoading = false;

  const options: Array<Setting> = [];

  Object.entries(data).forEach(([name, option]) => {
    options.push({name, option});
  });

  settings.data = options;
}

function onConnected() {
  WebSocketHandler.onQueryGameOptions();
}

useWebsocketHandlers({
  readGameOptions: onReadGameOptions,
}, onConnected);
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
