<template>
  <div id="instructions">Controls: Left Mouse Button or Spacebar</div>
  <div
    id="interaction-screen"
    ref="interactionScreen"
    tabindex="-1"
    @mousedown.left.prevent="interaction"
    @keydown.space.prevent="interaction"
    @keydown.prevent="keyEnter"
  ></div>
</template>

<script setup>
import { defineComponent, defineExpose, onMounted, ref } from "vue";
import emitter from "@/services/emitter";

defineComponent({
  name: "InteractionSection",
});

const interactionScreen = ref();

onMounted(() => {
  focus();
});

function focus() {
  interactionScreen.value.focus();
}

function interaction() {
  emitter.emit("interaction");
}

function keyEnter(e) {
  switch (e.key) {
    case "z":
      emitter.emit("item:accept");
      break;
    case "x":
      emitter.emit("item:reject");
      break;
  }
}

defineExpose({
  keyEnter,
  focus,
});
</script>

<style scoped>
#interaction-screen {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  user-select: none;
}

#instructions {
  color: rgb(160, 156, 156);
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>