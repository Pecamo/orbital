<template>
  <div class="scene" id="how">
    <div class="background"></div>
    <p>How to play Orbital:</p>
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
    <RouterLink class="button retry" to="/"> Back </RouterLink>
  </div>
</template>

<script setup lang="ts">
</script>
<style scoped>
#how {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 140%;
}
</style>
