<template>
  <div id="container">
    <RouterView class="view" />
    <!--div id="allBackground"></div-->

    <div class="credits">
      <div>
        Orbital is <a href="https://github.com/Pecamo/orbital">open source</a>
      </div>
      <div style="text-align: right">
        Orbital, 2020 - {{ currentYear }}, by <span v-html="names"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const protectator = '<a href="https://github.com/Protectator">Protectator</a>';
const binarybrain = '<a href="https://github.com/BinaryBrain">Binary Brain</a>';
const names = [
  [protectator, binarybrain],
  [binarybrain, protectator],
][Math.floor(Math.random() * 2)].join(" and ");
const currentYear = new Date().getFullYear();
</script>

<style>
@import "@/assets/base.css";
@import "@/assets/shared.css";
@import "@/assets/variables.css";

#app {
  height: 100%;
}

#container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(0, 23, 26);
  color: white;
}

.view {
  height: 100%;
}

.credits {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  opacity: 0.3;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
}

.credits a {
  color: inherit;
}
</style>
