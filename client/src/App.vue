<template>
  <div id="container">
    <div id="allBackground"></div>
    <RouterView />
  </div>

  <div class="credits">
    <div>
      Orbital is <a href="https://github.com/Pecamo/orbital">open source</a>
    </div>
    <div style="text-align: right">
      Orbital, 2020 - {{ currentYear }}, by <span v-html="names"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

console.log("Starting connection to WebSocket Server");
const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const ws = new WebSocket(wsProtocol + location.host + "/");

const protectator = '<a href="https://twitter.com/Protectator">Protectator</a>';
const binary_brain =
  '<a href="https://twitter.com/Binary_Brain">Binary Brain</a>';
const names = [
  [protectator, binary_brain],
  [binary_brain, protectator],
][Math.floor(Math.random() * 2)].join(" and ");
const currentYear = new Date().getFullYear();
</script>

<style>
@import "@/assets/base.css";
#app {
  height: 100%;
}

#allBackground {
  position: absolute;
  width: 120%;
  margin-left: -20%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-around;
  opacity: 0.2;
  overflow: hidden;
}

#allBackground * {
  overflow: hidden;
}

#allBackground .strip {
  width: 100%;
  height: 5vh;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-around;
  animation: slowMove 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

#allBackground .led {
  height: 2.5vh;
  width: 1.5vw;
  background-color: var(--base-color-bg);
  box-shadow: 0 0 10px 5px var(--base-color-bg);
  transition: all 1s;
}

#allBackground .led:hover {
  background-color: var(--base-color-fg);
  box-shadow: 0 0 10px 5px var(--base-color-fg);
}

.credits {
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 10px;
  opacity: 0.3;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  width: calc(100% - 20px);
}

.credits a {
  color: inherit;
}
</style>
