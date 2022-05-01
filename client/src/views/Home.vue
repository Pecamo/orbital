<template>
  <div id="container">
    <div id="allBackground"></div>
    <div class="scene active" id="welcome">
      <div class="background"></div>
      Welcome to
      <div class="orbital"><img src="@/assets/logo/Orbital-white.svg" /></div>
      <button class="button" id="joinButton" onmouseup="onJoinRelease()">
        Join a game
      </button>
      <button
        class="button mini"
        id="changeOptionsButton"
        onmouseup="onChangeOptionsRelease()"
      >
        Change game settings
      </button>
      <button class="button mini" id="howButton" onmouseup="onHowRelease()">
        How to play
      </button>
      <button
        class="button mini"
        id="spectateButton"
        onmouseup="onSpectateRelease()"
      >
        Spectate mode
        <div id="spectate-viz"></div>
      </button>
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
    <div class="scene" id="how">
      <div class="background"></div>
      <p>How to play Orbital :</p>
      <p>
        You control a colored LED<br />
        Your goal is to <b>survive</b> the longest<br />
        Move with the
        <img class="img" src="@/assets/left-arrow.svg" style="height: 3vw" />
        and
        <img class="img" src="@/assets/right-arrow.svg" style="height: 3vw" />
        arrows<br />
        Shoot others with the middle
        <img class="img" src="@/assets/target.svg" style="height: 3vw" /> button
      </p>
      <button class="button retry" onclick="activateSceneWelcome()">
        Back
      </button>
    </div>
    <div class="scene" id="spectate">
      <div class="background"></div>
      <canvas id="spectateCanvas" width="600" height="600"></canvas>
      <div id="spectateResult"></div>
    </div>
    <div class="scene" id="changeGameOptions">
      <div class="background"></div>
      <h1>Change Game Settings</h1>
      <div id="gameOptionsScene"></div>
    </div>
    <div class="scene" id="wait">
      <div class="background"></div>
      <p>Waiting for an opponent to connect...</p>
      <button class="button" id="cancelButton" onmouseup="onCancelRelease()">
        Cancel
      </button>
    </div>
    <div class="scene" id="getReady">
      <div class="background"></div>
      <p>Waiting for eventual other players...</p>
      <p>Starting in <span id="startsIn">20</span> sec</p>
      <p
        style="
          padding: 2vw;
          background-color: var(--base-color-bg);
          color: black;
        "
      >
        Remember your color !
      </p>
    </div>
    <div class="scene" id="play">
      <div class="background"></div>
      <button class="left button" id="leftButton">
        <img class="img" src="@/assets/left-arrow.svg" />
      </button>
      <button class="fire button" id="fireButton">
        <img class="img" src="@/assets/target.svg" />
      </button>
      <button class="right button" id="rightButton">
        <img class="img" src="@/assets/right-arrow.svg" />
      </button>
    </div>
    <div class="scene" id="won">
      <div class="background"></div>
      <p style="color: var(--base-color-bg)">CONGRATULATIONS</p>
      <p>You won !</p>
      <button class="button retry" onclick="activateSceneWelcome()">
        Play again
      </button>
    </div>
    <div class="scene" id="lost">
      <div class="background"></div>
      <p>GAME OVER</p>
      <p>You died.</p>
      <button class="button retry" onclick="activateSceneWelcome()">
        Play again
      </button>
    </div>
    <div class="scene" id="gameInProgress">
      <div class="background"></div>
      <p>A game is currently in progress.</p>
      <p>Spectate and be ready for the next game !</p>
      <button class="button retry" onclick="activateSceneWelcome()">
        Try again
      </button>
    </div>
  </div>
  <audio id="sound-fire" src="./assets/sounds/fire.mp3"></audio>
  <audio id="sound-victory" src="./assets/sounds/victory.mp3"></audio>
  <audio id="sound-defeat" src="./assets/sounds/defeat.mp3"></audio>
  <audio id="sound-confirm" src="./assets/sounds/confirm.wav"></audio>
  <audio id="sound-start" src="./assets/sounds/start.wav"></audio>
  <audio id="sound-button" src="./assets/sounds/button.wav"></audio>
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

.scene {
  width: 100%;
  height: 100%;
  display: none;
  position: relative;
  justify-content: space-between;
  color: var(--base-color-fg);
}

.scene.active {
  display: flex !important;
  align-items: center;
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

canvas.spectateCanvas {
  height: 100%;
}

input[type="checkbox"] {
  width: 2vw;
  height: 2vw;
}

input[type="radio"] {
  width: 1.4vw;
  height: 1.4vw;
}

input[type="number"] {
  font-size: 2vw;
  text-align: right;
  max-width: 5vw;
}

label {
  font-size: 2vw;
}
</style>
