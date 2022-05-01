<template>
  <div id="container" class="page-grid">
    <div class="line">
      <h1>Lamp</h1>
    </div>
    <div class="line">
      <label>Animation Mode</label>
      <select name="animation" id="animation-picker">
        <option value="none">None</option>
        <option value="strobe">Strobe</option>
        <option value="alternating">Alternating</option>
        <option value="rainbow">Rainbow</option>
        <option value="fire">Fire</option>
        <option value="fire_wheel">Fire Wheel</option>
        <option value="stars">Stars</option>
        <option value="matrix_wheel">Matrix Wheel</option>
        <option value="sliding_window">Sliding Window</option>
        <option value="old_school_segments">Old School Segments</option>
        <option value="game_of_life">Game of Life</option>
      </select>
    </div>
    <div class="line">
      <label>Color 1</label>
      <div>
        <input type="color" data-id="0" class="color-picker" />
      </div>
    </div>
    <div class="line">
      <label>Color 2</label>
      <div>
        <input type="color" data-id="1" class="color-picker" />
      </div>
    </div>
    <div class="line">
      <label>Top Led Number</label>
      <div>
        <input type="number" class="top-led-number" min="0" step="1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts"></script>
<style scoped>
input {
  height: 100%;
  width: 100%;
  text-align: right;
}

.page-grid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
}

.page-grid .line {
  display: flex;
  height: 0;
  flex-grow: 1;
  width: 100%;
}

.page-grid .line > * {
  width: 0;
  flex-grow: 1;
  margin: calc(2 * var(--unit));
}

.page-grid .line > :not(:first-child) {
  margin-left: 1vw;
}

.page-grid .line label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-grow: 1;
}
</style>
