<template>
  <div id="game-over-screen">
    <div id="container">
      <h1>Game Over</h1>
      <button @click.left.prevent="restart">Rejoin</button>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";
import emitter from "@/services/emitter";

defineComponent({
  name: "GameOverSection",
});

function restart() {
  emitter.emit("restart");
}
</script>

<style scoped>
#game-over-screen {
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  z-index: 25;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  user-select: none;
}

#container {
  text-align: center;
}

h1 {
  font-size: 69px;
  margin: 20px 20px;
}
</style>