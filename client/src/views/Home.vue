<template>
  <div id="container">
    <div id="allBackground"></div>
    <div class="scene active" id="welcome">
      <div class="background"></div>
      Welcome to
      <div class="orbital"><img src="@/assets/logo/Orbital-white.svg" /></div>
      <RouterLink to="/join" class="button" id="joinButton"
        >Join a game</RouterLink
      >
      <RouterLink to="/settings" class="button mini" id="changeOptionsButton"
        >Change game settings</RouterLink
      >
      <RouterLink to="/howto" class="button mini" id="howButton"
        >How to play</RouterLink
      >
      <RouterLink to="/spectate" class="button mini" id="spectateButton"
        >Spectate mode
        <div id="spectate-viz"></div
      ></RouterLink>
      <RouterLink to="/lamp" class="button mini" id="lampButton">
        Lamp mode
      </RouterLink>
      <div class="credits">
        <div>
          Orbital is <a href="https://github.com/Pecamo/orbital">open source</a>
        </div>
        <div style="text-align: right">
          Orbital, 2020 - <span class="currentYear"></span>, by
          <span class="names"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts"></script>
<style scoped>
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

img.img {
  pointer-events: none;
}

#welcome {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: var(--base-color-fg);
}

#welcome .button {
  font-size: 6vw;
  padding: 2vw;
  margin-top: 4vh;
  margin-bottom: 4vh;
}

#welcome .button.mini {
  font-size: 2vw;
  margin-top: 1vh;
  padding: 1vw;
  margin-bottom: 2vh;
}

#welcome .button:disabled {
  filter: brightness(0.4);
}

#welcome .orbital {
  font-size: 4vw;
  margin-bottom: 2vw;
  margin-top: 4vw;
}

#welcome .orbital img {
  height: 15vh;
}

#play .button {
  background-color: var(--base-color-bg);
  color: var(--base-color-fg);
  justify-content: center;
  align-items: center;
  font-size: 20vw;
  flex-grow: 1;
  height: 100%;
  border: 0;
  max-width: 32%;
  max-height: 98%;
  fill: white;
}

#play .button:active {
  filter: contrast(0.5);
}

#wait,
#getReady,
#won,
#lost,
#gameInProgress,
#how,
#spectate {
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#wait .button {
  font-size: 3vw;
  padding: 1vw;
  margin-top: 6vh;
  margin-bottom: 6vh;
}

#how {
  line-height: 140%;
}

#changeGameOptions {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: var(--base-color-fg);
}

#changeGameOptions .name {
  margin-top: 3vw;
  margin-bottom: 2vw;
  font-size: 3vw;
}

#changeGameOptions .radio-inputs {
  display: flex;
  justify-content: space-around;
  text-transform: capitalize;
}

#changeGameOptions .button {
  font-size: 3vw;
  padding: 1vw;
  margin: 3vw auto;
}

#changeGameOptions [type="checkbox"],
#changeGameOptions [type="radio"] {
  transform: scale(1.3);
  margin: 0 1vw;
}

.fire {
  font-size: 25vw;
}

.left {
}

.right {
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

#spectateResult {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.s-strip {
}

.s-led {
  position: absolute;
  padding-top: 100px;
  height: calc(40% - 40px);
  width: 1px;
  overflow-x: visible;
  transform-origin: top;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.s-led .light {
  height: 20px;
  width: 100%;
  min-width: 20px;
  background-color: black;
}

#spectate .background {
  background-color: #444444;
}
</style>
